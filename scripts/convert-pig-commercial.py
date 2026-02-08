"""
Conversion Script: Pig Commercial Assessment Data
Converts Pig_commercial_final.json to system-compatible format
"""

import json
import os
from pathlib import Path

# Paths
SCRIPT_DIR = Path(__file__).parent
INPUT_FILE = SCRIPT_DIR.parent.parent / 'Pig_commercial_final.json'
OUTPUT_DIR = SCRIPT_DIR.parent

# Category to Focus Area mapping
CATEGORY_TO_FOCUS_AREA = {
    'farm_information': 1,
    'breeding_animal_supply': 1,
    'feed_water_supply': 2,
    'visitor_management': 2,
    'equipment_vehicles': 2,
    'disease_management': 3,
    'manure_carcass': 3,
    'vermin_control': 3,
    'production_practices': 3,
    'cleaning_disinfection': 4,
    'maintenance': 4
}

# Focus Area metadata
FOCUS_AREA_METADATA = {
    1: {
        'name': {'en': 'Purchase & Transport', 'id': 'Pembelian & Transportasi', 'vt': 'Mua & Vận Chuyển'},
        'description': {
            'en': 'Prevent disease entry through animals and vehicles',
            'id': 'Mencegah masuknya penyakit melalui hewan dan kendaraan',
            'vt': 'Ngăn ngừa bệnh xâm nhập qua động vật và phương tiện'
        },
        'category': 'external_biosecurity',
        'sections': ['A', 'B']
    },
    2: {
        'name': {'en': 'Facilities & People', 'id': 'Fasilitas & Orang', 'vt': 'Cơ Sở & Con Người'},
        'description': {
            'en': 'Control access and maintain biosecure facilities',
            'id': 'Kontrol akses dan pertahankan fasilitas biosekuriti',
            'vt': 'Kiểm soát truy cập và duy trì cơ sở an toàn sinh học'
        },
        'category': 'external_biosecurity',
        'sections': ['C', 'D', 'E']
    },
    3: {
        'name': {'en': 'Production Management', 'id': 'Manajemen Produksi', 'vt': 'Quản Lý Sản Xuất'},
        'description': {
            'en': 'Manage disease risk and production practices',
            'id': 'Kelola risiko penyakit dan praktik produksi',
            'vt': 'Quản lý rủi ro bệnh và thực hành sản xuất'
        },
        'category': 'internal_biosecurity',
        'sections': ['F', 'G', 'H', 'I']
    },
    4: {
        'name': {'en': 'Cleaning & Disinfection', 'id': 'Pembersihan & Disinfeksi', 'vt': 'Vệ Sinh & Khử Trùng'},
        'description': {
            'en': 'Maintain hygiene through proper cleaning and maintenance',
            'id': 'Pertahankan kebersihan melalui pembersihan dan pemeliharaan yang tepat',
            'vt': 'Duy trì vệ sinh thông qua làm sạch và bảo trì đúng cách'
        },
        'category': 'internal_biosecurity',
        'sections': ['J', 'K']
    }
}

def extract_lang_text(obj, lang):
    """Extract language-specific text"""
    if not obj:
        return ''
    if isinstance(obj, str):
        return obj
    
    # Map vt to vi
    lang_key = 'vi' if lang == 'vt' else lang
    return obj.get(lang_key, obj.get('en', ''))

def convert_answer_type(answer_type):
    """Convert answer type"""
    type_map = {
        'single_choice': 'single_choice',
        'multi_choice': 'multiple_choice',
        'number_input': 'numeric',
        'text_input': 'text'
    }
    return type_map.get(answer_type, answer_type)

def convert_conditional_logic(cond_logic):
    """Convert conditional logic format"""
    if not cond_logic:
        return None
    
    for answer, action in cond_logic.items():
        if action.startswith('skip_to_'):
            target_id = action.replace('skip_to_', '').lower()
            return {
                'if_answer': answer,
                'then': 'skip_to',
                'target': target_id
            }
    return None

def infer_farm_type_relevance(question):
    """Infer farm type relevance from question content"""
    question_str = json.dumps(question).lower()
    
    relevance = []
    
    if any(word in question_str for word in ['breeding', 'sow', 'gilt', 'boar', 'farrowing', 'suckling']):
        relevance.extend(['breeding', 'farrow_to_finish'])
    
    if any(word in question_str for word in ['slaughter', 'finishing', 'piglet']):
        relevance.extend(['finishing', 'farrow_to_finish'])
    
    if 'weaned' in question_str or 'nursery' in question_str:
        relevance.extend(['nursery', 'farrow_to_finish'])
    
    if not relevance:
        return ['breeding', 'finishing', 'nursery', 'farrow_to_finish']
    
    return list(set(relevance))

def convert_question(question, lang, question_number, focus_area_number, section_letter):
    """Convert a single question"""
    converted = {
        'number': question_number,
        'id': question['id'].lower(),
        'section': section_letter,
        'focus_area': focus_area_number,
        'text': extract_lang_text(question['question'], lang),
        'type': convert_answer_type(question['answer_type']),
        'required': question.get('required', False)
    }
    
    # Convert options (normalize scoring 0-10 → 0-100)
    if 'options' in question:
        converted['options'] = []
        for opt in question['options']:
            converted['options'].append({
                'value': opt['id'],
                'text': extract_lang_text(opt['label'], lang),
                'score': opt.get('score', 0) * 10
            })
    
    # Add validation
    if 'validation' in question:
        converted['validation'] = question['validation']
    
    # Add conditional logic
    cond_logic = convert_conditional_logic(question.get('conditional_logic'))
    if cond_logic:
        converted['conditional_logic'] = cond_logic
    
    # Farm type relevance
    converted['farm_type_relevance'] = infer_farm_type_relevance(question)
    
    # Enhanced risk assessment
    if 'risk_assessment' in question:
        ra = question['risk_assessment']
        converted['risk_assessment'] = {
            'risk_description': extract_lang_text(ra.get('risk_description'), lang),
            'recommendation': extract_lang_text(ra.get('recommendation'), lang),
            'priority': ra.get('priority', 'medium'),
            'trigger_score_threshold': ra.get('trigger_score', 5) * 10,
            'diseases_affected': ra.get('diseases_affected', [])
        }
    
    return converted

def convert_farm_profile(source_data, lang):
    """Convert farm profile questions"""
    farm_info_cat = next((cat for cat in source_data['categories'] if cat['id'] == 'farm_information'), None)
    
    if not farm_info_cat:
        raise ValueError('farm_information category not found')
    
    profile = {
        'title': extract_lang_text(farm_info_cat['name'], lang),
        'description': extract_lang_text(farm_info_cat['description'], lang),
        'total_questions': len(farm_info_cat['questions']),
        'questions': []
    }
    
    roman_numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']
    
    for idx, q in enumerate(farm_info_cat['questions']):
        converted = {
            'number': roman_numerals[idx] if idx < len(roman_numerals) else str(idx + 1),
            'id': f"pre_{q['id'].lower()}",
            'text': extract_lang_text(q['question'], lang),
            'type': convert_answer_type(q['answer_type']),
            'required': q.get('required', False)
        }
        
        if 'options' in q:
            converted['options'] = []
            for opt in q['options']:
                converted['options'].append({
                    'value': opt['id'],
                    'text': extract_lang_text(opt['label'], lang)
                })
        
        if 'validation' in q:
            converted['validation'] = q['validation']
        
        cond_logic = convert_conditional_logic(q.get('conditional_logic'))
        if cond_logic:
            converted['conditional_logic'] = cond_logic
        
        converted['farm_type_relevance'] = ['breeding', 'finishing', 'nursery', 'farrow_to_finish']
        
        if q['id'] == 'Q1':
            converted['farm_type_detection'] = True
        
        profile['questions'].append(converted)
    
    return profile

def convert_assessment(source_data, lang):
    """Convert assessment questions"""
    focus_areas = []
    global_question_number = 1
    
    for fa_num in range(1, 5):
        focus_area = {
            'number': fa_num,
            'name': extract_lang_text(FOCUS_AREA_METADATA[fa_num]['name'], lang),
            'description': extract_lang_text(FOCUS_AREA_METADATA[fa_num]['description'], lang),
            'category': FOCUS_AREA_METADATA[fa_num]['category'],
            'sections': FOCUS_AREA_METADATA[fa_num]['sections'],
            'questions': []
        }
        
        section_index = 0
        
        for category in source_data['categories']:
            if CATEGORY_TO_FOCUS_AREA.get(category['id']) == fa_num:
                if category['id'] == 'farm_information':
                    continue
                
                section_letter = FOCUS_AREA_METADATA[fa_num]['sections'][section_index] if section_index < len(FOCUS_AREA_METADATA[fa_num]['sections']) else 'A'
                
                for question in category['questions']:
                    converted = convert_question(
                        question,
                        lang,
                        global_question_number,
                        fa_num,
                        section_letter
                    )
                    focus_area['questions'].append(converted)
                    global_question_number += 1
                
                section_index += 1
        
        focus_area['total_questions'] = len(focus_area['questions'])
        focus_area['estimated_time_minutes'] = max(1, len(focus_area['questions']) // 4)
        
        focus_areas.append(focus_area)
    
    return {
        'total_questions': global_question_number - 1,
        'focus_areas': focus_areas
    }

def convert_glossary(source_data, lang):
    """Convert glossary"""
    glossary = {}
    for term, definition in source_data['glossary'].items():
        glossary[term] = extract_lang_text(definition, lang)
    return glossary

def generate_language_file(source_data, lang):
    """Generate output file for a specific language"""
    print(f"\n🔄 Converting to {lang.upper()}...")
    
    output = {
        'language': lang,
        'language_name': {'en': 'English', 'id': 'Indonesian', 'vt': 'Vietnamese'}[lang],
        'version': source_data.get('version', '4.0'),
        'source': source_data.get('source', 'Biocheck.Gent BV'),
        'glossary': convert_glossary(source_data, lang),
        'farm_profile': convert_farm_profile(source_data, lang),
        'assessment': convert_assessment(source_data, lang)
    }
    
    print(f"   ✅ Farm profile: {len(output['farm_profile']['questions'])} questions")
    print(f"   ✅ Assessment: {output['assessment']['total_questions']} questions across {len(output['assessment']['focus_areas'])} focus areas")
    
    return output

def main():
    print('🚀 Starting Pig Commercial Assessment Conversion\n')
    print('=' * 60)
    
    try:
        # Load input data
        print(f'📂 Loading input file: {INPUT_FILE}')
        
        if not INPUT_FILE.exists():
            raise FileNotFoundError(f'Input file not found: {INPUT_FILE}')
        
        with open(INPUT_FILE, 'r', encoding='utf-8') as f:
            source_data = json.load(f)
        
        print('✅ Loaded successfully')
        print(f"   - Total categories: {len(source_data['categories'])}")
        print(f"   - Total questions: {source_data['total_questions']}")
        
        # Convert for each language
        for lang in ['en', 'id', 'vt']:
            converted = generate_language_file(source_data, lang)
            
            output_path = OUTPUT_DIR / f'questions_{lang}.json'
            
            print(f"\n💾 Writing {lang.upper()} file...")
            print(f"   Path: {output_path}")
            
            # Create backup if exists
            if output_path.exists():
                backup_path = output_path.with_suffix('.json.backup')
                output_path.rename(backup_path)
                print(f"   📋 Backup created: {backup_path}")
            
            # Write new file
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(converted, f, indent=2, ensure_ascii=False)
            
            print(f"   ✅ File written successfully")
        
        print('\n' + '=' * 60)
        print('✅ Conversion completed successfully!')
        print('\nGenerated files:')
        print(f"   - {OUTPUT_DIR / 'questions_en.json'}")
        print(f"   - {OUTPUT_DIR / 'questions_id.json'}")
        print(f"   - {OUTPUT_DIR / 'questions_vt.json'}")
        print('\n💡 Next steps:')
        print('   1. Review generated files for accuracy')
        print('   2. Test with development server: npm run dev')
        print('   3. Complete a test assessment to verify functionality')
        
    except Exception as error:
        print(f'\n❌ Conversion failed: {error}')
        import traceback
        traceback.print_exc()
        exit(1)

if __name__ == '__main__':
    main()
