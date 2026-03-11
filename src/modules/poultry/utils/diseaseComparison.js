export function calculateSymptomOverlap(disease1, disease2) {
  const symptoms1 = (disease1.symptomsEnhanced || disease1.gejala_diperkaya || []).map(s => s.id || s);
  const symptoms2 = (disease2.symptomsEnhanced || disease2.gejala_diperkaya || []).map(s => s.id || s);
  
  const common = symptoms1.filter(id => symptoms2.includes(id));
  const unique1 = symptoms1.filter(id => !symptoms2.includes(id));
  const unique2 = symptoms2.filter(id => !symptoms1.includes(id));
  
  const totalUnique = symptoms1.length + symptoms2.length - common.length;
  const percentage = totalUnique > 0 ? Math.round((common.length / totalUnique) * 100) : 0;
  
  const getSymptomName = (id) => {
    const s1 = (disease1.symptomsEnhanced || disease1.gejala_diperkaya || []).find(s => (s.id || s) === id);
    const s2 = (disease2.symptomsEnhanced || disease2.gejala_diperkaya || []).find(s => (s.id || s) === id);
    return (s1?.name || s1?.nama || s2?.name || s2?.nama || id);
  };
  
  return {
    common: common.map(getSymptomName),
    unique1: unique1.map(getSymptomName),
    unique2: unique2.map(getSymptomName),
    percentage
  };
}
