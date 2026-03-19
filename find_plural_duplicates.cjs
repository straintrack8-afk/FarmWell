const fs = require('fs');

function findPluralDuplicates() {
  const enData = JSON.parse(
    fs.readFileSync('./public/data/swine/pig_diseases_COMPLETE_104_v1.0_ENRICHED_en.json', 'utf8')
  );
  
  // Extract all unique symptoms
  const symptomMap = new Map();
  
  enData.diseases.forEach(disease => {
    const symptoms = disease.symptomsEnhanced || disease.symptoms || [];
    symptoms.forEach(symptom => {
      const name = typeof symptom === 'string' ? symptom : symptom.name;
      const id = typeof symptom === 'object' ? symptom.id : null;
      if (name) {
        if (!symptomMap.has(name)) {
          symptomMap.set(name, { count: 0, id: id, diseases: [] });
        }
        const entry = symptomMap.get(name);
        entry.count++;
        entry.diseases.push(disease.name);
      }
    });
  });
  
  // Sort alphabetically
  const symptoms = Array.from(symptomMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => a.name.localeCompare(b.name));
  
  console.log('\n=== FINDING PLURAL DUPLICATES ONLY ===\n');
  
  const pluralDuplicates = [];
  
  for (let i = 0; i < symptoms.length - 1; i++) {
    const current = symptoms[i].name;
    const next = symptoms[i + 1].name;
    
    // Check for simple plural variations (word vs word + "s")
    // Example: "Lesion" vs "Lesions", "Hemorrhage" vs "Hemorrhages"
    if (current + 's' === next || current === next + 's') {
      const singular = current.length < next.length ? current : next;
      const plural = current.length > next.length ? current : next;
      
      pluralDuplicates.push({
        type: 'PLURAL',
        singular: singular,
        plural: plural,
        singularCount: symptoms[i].count,
        pluralCount: symptoms[i + 1].count,
        suggestion: singular,
        diseases: {
          singular: symptomMap.get(singular).diseases,
          plural: symptomMap.get(plural).diseases
        }
      });
      
      console.log(`PLURAL: "${singular}" (${symptomMap.get(singular).count} diseases) vs "${plural}" (${symptomMap.get(plural).count} diseases)`);
      console.log(`  → Suggested fix: Use "${singular}" (singular form)\n`);
    }
  }
  
  // Save report
  const report = {
    totalSymptoms: symptoms.length,
    pluralDuplicatesFound: pluralDuplicates.length,
    duplicates: pluralDuplicates,
    summary: {
      note: 'This report contains ONLY simple plural variations (word vs word+s)',
      excluded: [
        'Order variations (A/B vs B/A) - clinical sequence matters',
        'Compound symptoms - will be clarified with tooltips',
        'Similar strings - too risky without medical review'
      ]
    }
  };
  
  fs.writeFileSync('./PLURAL_DUPLICATES_REPORT.json', JSON.stringify(report, null, 2));
  
  console.log(`\n=== SUMMARY ===`);
  console.log(`Total unique symptoms: ${symptoms.length}`);
  console.log(`Plural duplicates found: ${pluralDuplicates.length}`);
  console.log(`Report saved to: PLURAL_DUPLICATES_REPORT.json\n`);
  
  if (pluralDuplicates.length > 0) {
    console.log('=== DUPLICATES TO FIX ===');
    pluralDuplicates.forEach((dup, idx) => {
      console.log(`${idx + 1}. "${dup.plural}" → "${dup.singular}"`);
    });
    console.log('\nReview PLURAL_DUPLICATES_REPORT.json for full details.\n');
  } else {
    console.log('✅ No plural duplicates found! Data is clean.\n');
  }
}

findPluralDuplicates();
