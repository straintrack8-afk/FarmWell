import React,{useState,useEffect}from'react';
import{useNavigate,useParams}from'react-router-dom';
import{useTranslation}from'../../../hooks/useTranslation';
import SharedTopNav from'../../../components/SharedTopNav';
import{flockStorage}from'../utils/flockStorage';
import CombinedChart from'../components/CombinedChart';
import DailyEntry from'../components/DailyEntry';
import{DailyMortalityChart}from'../components/DepletionCharts';
import{BROILER_RANGE}from'../data/broilerRangeData';
import{getColorRange}from'../data/colorChickenRangeData';
const getCurrentDay=(placementDate)=>{
const placed=new Date(placementDate),today=new Date();
const diff=Math.floor((today-placed)/(1000*60*60*24))+1;
return Math.min(Math.max(diff,1),56);
};
const getCurrentWeek=(day)=>Math.ceil(day/7);
const getFlockStatus=(history,moduleId,variant,sex)=>{
if(!history.length)return'no_data';
const latest=history[history.length-1];
let std;
if(moduleId==='color_chicken'){
const rangeData=getColorRange(variant||'choi',sex||'male');
std=rangeData.find(r=>r.day===latest.day);
}else{
std=BROILER_RANGE.find(r=>r.day===latest.day);
}
if(!std||!latest.bw_actual_g)return'no_data';
if(latest.bw_actual_g<std.bw_low_alert)return'below';
if(latest.bw_actual_g>std.bw_high_alert)return'above';
return'on_track';
};
const STATUS_CFG=(t)=>({on_track:{label:t('farmguide.onTrack')||'✓ On Track',color:'#10b981'},below:{label:t('farmguide.belowTarget')||'⚠ Below Target',color:'var(--fw-orange)'},above:{label:t('farmguide.aboveTarget')||'↑ Above Target',color:'#2563EB'},no_data:{label:t('common.noData')||'No Data',color:'#999'}});
function FlockSaya({module:moduleProp,embedded=false}){
const navigate=useNavigate();
const{module:moduleParam}=useParams();
const module=moduleProp||moduleParam;
const{t}=useTranslation();
const[currentView,setCurrentView]=useState('list');
const[flocks,setFlocks]=useState([]);
const[selectedFlock,setSelectedFlock]=useState(null);
const[history,setHistory]=useState([]);
const[showDailyEntry,setShowDailyEntry]=useState(false);
const[formData,setFormData]=useState({name:'',placement_date:'',initial_pop:'',notes:'',variant:'choi',sex:'male'});
useEffect(()=>{loadFlocks();},[]);
const loadFlocks=()=>{setFlocks(flockStorage.getAllFlocks().filter(f=>f.module_id===module));};
const loadFlockDetail=(flockId)=>{
const flock=flockStorage.getFlock(flockId);
if(flock){setSelectedFlock(flock);setHistory(flockStorage.getHistory(flockId));setCurrentView('detail');}
};
const handleAddFlock=()=>{setFormData({name:'',placement_date:'',initial_pop:'',notes:'',variant:'choi',sex:'male'});setCurrentView('add');};
const handleSaveFlock=(e)=>{
e.preventDefault();
if(!formData.name||!formData.placement_date||!formData.initial_pop)return alert('Please fill required fields');
const flock={id:flockStorage.generateId(),name:formData.name,module_id:module,breed_code:null,breed_label:null,sex:module==='color_chicken'?formData.sex:null,variant:module==='color_chicken'?formData.variant:null,placement_date:formData.placement_date,initial_pop:parseInt(formData.initial_pop),notes:formData.notes,created_at:new Date().toISOString(),status:'active'};
flockStorage.saveFlock(flock);
loadFlocks();
loadFlockDetail(flock.id);
};
const handleSaveEntry=(entry)=>{
flockStorage.saveEntry(selectedFlock.id,entry);
setHistory(flockStorage.getHistory(selectedFlock.id));
setShowDailyEntry(false);
};
const handleInputDay=(flock)=>{setSelectedFlock(flock);setHistory(flockStorage.getHistory(flock.id));setShowDailyEntry(true);};const renderListView=()=>(
<div>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
<h1 style={{margin:0,fontSize:'1.75rem',color:'var(--fw-text)'}}>{t('farmguide.flockSaya')||'Flock Saya'}</h1>
<button onClick={handleAddFlock} style={{padding:'0.75rem 1.5rem',background:'var(--fw-teal)',color:'white',border:'none',borderRadius:'8px',fontSize:'1rem',fontWeight:'600',cursor:'pointer'}}>{t('farmguide.addFlock')||'+ Add Flock'}</button>
</div>
{flocks.length===0?(
<div style={{padding:'3rem',textAlign:'center',background:'var(--fw-card)',borderRadius:'12px',border:'1px solid var(--fw-border)'}}>
<p style={{margin:'0 0 1rem',fontSize:'1.125rem',color:'var(--fw-sub)'}}>{t('farmguide.noFlocks')||'No flocks saved yet.'}</p>
<button onClick={handleAddFlock} style={{padding:'0.75rem 1.5rem',background:'var(--fw-teal)',color:'white',border:'none',borderRadius:'8px',fontSize:'1rem',fontWeight:'600',cursor:'pointer'}}>{t('farmguide.addFlock')||'+ Add First Flock'}</button>
</div>
):(
<div style={{display:'grid',gap:'1rem'}}>
{flocks.map(flock=>{
const currentDay=getCurrentDay(flock.placement_date);
const currentWeek=getCurrentWeek(currentDay);
const hist=flockStorage.getHistory(flock.id);
const latest=hist[hist.length-1];
let std;
if(module==='color_chicken'){
const rangeData=getColorRange(flock.variant||'choi',flock.sex||'male');
std=latest?rangeData.find(r=>r.day===latest.day):null;
}else{
std=latest?BROILER_RANGE.find(r=>r.day===latest.day):null;
}
const status=getFlockStatus(hist,flock.module_id,flock.variant,flock.sex);
const statusCfg=STATUS_CFG[status];
return(
<div key={flock.id} style={{padding:'1.5rem',background:'var(--fw-card)',border:'1px solid var(--fw-border)',borderRadius:'12px'}}>
<div style={{marginBottom:'1rem'}}>
<h3 style={{margin:'0 0 0.5rem',fontSize:'1.25rem',color:'var(--fw-text)'}}>🐔 {flock.name}</h3>
<p style={{margin:0,fontSize:'0.875rem',color:'var(--fw-sub)'}}>DOC: {new Date(flock.placement_date).toLocaleDateString()} · {t('farmguide.population')}: {flock.initial_pop.toLocaleString()}</p>
</div>
{latest&&std&&(
<div style={{padding:'0.75rem',background:'var(--fw-bg)',borderRadius:'8px',marginBottom:'1rem'}}>
<p style={{margin:0,fontSize:'0.875rem',color:'var(--fw-text)'}}>BW Actual: <strong>{latest.bw_actual_g}g</strong> · Range: {std.bw_low_alert}–{std.bw_high_alert}g · <span style={{color:statusCfg.color,fontWeight:'600'}}>{statusCfg.label}</span></p>
</div>
)}
{(()=>{
const initialPop=flock.initial_pop;
const lastEntry=hist.length?hist[hist.length-1]:null;
const lastDay=lastEntry?.day||0;
let totalFeedG=0;
let currentPop=initialPop;
for(let day=1;day<=lastDay;day++){
const entry=hist.find(h=>h.day===day);
let stdRow;
if(module==='color_chicken'){
const rangeData=getColorRange(flock.variant||'choi',flock.sex||'male');
stdRow=rangeData.find(r=>r.day===day);
}else{
stdRow=BROILER_RANGE.find(r=>r.day===day);
}
const mortality=entry?.mortality||0;
currentPop=currentPop-mortality;
const feedPerHead=entry?.feed_actual_g??stdRow?.feed_avg??0;
totalFeedG+=feedPerHead*currentPop;
}
const totalFeedKg=totalFeedG/1000;
let lastBW;
if(module==='color_chicken'){
const rangeData=getColorRange(flock.variant||'choi',flock.sex||'male');
lastBW=lastEntry?.bw_actual_g||rangeData.find(r=>r.day===lastDay)?.bw_avg||0;
}else{
lastBW=lastEntry?.bw_actual_g||BROILER_RANGE.find(r=>r.day===lastDay)?.bw_avg||0;
}
const fcr=(totalFeedKg>0&&lastBW>0&&currentPop>0)?(totalFeedKg/((lastBW*currentPop)/1000)).toFixed(2):null;
let stdD1;
if(module==='color_chicken'){
const rangeData=getColorRange(flock.variant||'choi',flock.sex||'male');
stdD1=rangeData.find(r=>r.day===1);
}else{
stdD1=BROILER_RANGE.find(r=>r.day===1);
}
const bwStart=hist.find(h=>h.day===1)?.bw_actual_g??stdD1?.bw_avg??40;
let bwEnd;
if(module==='color_chicken'){
const rangeData=getColorRange(flock.variant||'choi',flock.sex||'male');
bwEnd=lastEntry?.bw_actual_g??rangeData.find(r=>r.day===lastDay)?.bw_avg??null;
}else{
bwEnd=lastEntry?.bw_actual_g??BROILER_RANGE.find(r=>r.day===lastDay)?.bw_avg??null;
}
const adg=(bwEnd&&lastDay>0)?Math.round((bwEnd-bwStart)/lastDay):null;
const totalDead=hist.reduce((sum,h)=>sum+(h.mortality||0),0);
const depletion=initialPop?((totalDead/initialPop)*100).toFixed(2):null;
return(adg||fcr||depletion!==null||lastDay>0)?(
<div style={{display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:'0.5rem',marginTop:'0.75rem',marginBottom:'0.75rem'}}>
<div style={{background:'var(--fw-bg)',borderRadius:'8px',padding:'0.875rem 1rem',textAlign:'center'}}>
<div style={{fontSize:'13px',color:'var(--fw-sub)',marginBottom:'2px'}}>{t('farmguide.raisingDay')||'Raising Day'}</div>
<div style={{fontSize:'1.5rem',fontWeight:'700',color:'var(--fw-text)',fontFamily:'DM Mono, monospace'}}>
{lastDay>0?`D${lastDay}`:'—'}
</div>
</div>
<div style={{background:'var(--fw-bg)',borderRadius:'8px',padding:'0.875rem 1rem',textAlign:'center'}}>
<div style={{fontSize:'13px',color:'var(--fw-sub)',marginBottom:'2px'}}>ADG</div>
<div style={{fontSize:'1.5rem',fontWeight:'700',color:'var(--fw-text)',fontFamily:'DM Mono, monospace'}}>
{adg?`${adg} g/day`:'—'}
</div>
</div>
<div style={{background:'var(--fw-bg)',borderRadius:'8px',padding:'0.875rem 1rem',textAlign:'center'}}>
<div style={{fontSize:'13px',color:'var(--fw-sub)',marginBottom:'2px'}}>FCR</div>
<div style={{fontSize:'1.5rem',fontWeight:'700',color:'var(--fw-text)',fontFamily:'DM Mono, monospace'}}>
{fcr??'—'}
</div>
</div>
<div style={{background:'var(--fw-bg)',borderRadius:'8px',padding:'0.875rem 1rem',textAlign:'center'}}>
<div style={{fontSize:'13px',color:'var(--fw-sub)',marginBottom:'2px'}}>{t('farmguide.depletion')||'Depletion'}</div>
<div style={{fontSize:'1.5rem',fontWeight:'700',color:depletion>5?'#EF4444':'var(--fw-text)',fontFamily:'DM Mono, monospace'}}>
{depletion!==null?`${depletion}%`:'—'}
</div>
</div>
</div>
):null;
})()}
<div style={{display:'flex',gap:'0.75rem'}}>
<button onClick={()=>loadFlockDetail(flock.id)} style={{flex:1,padding:'0.625rem',background:'var(--fw-teal)',color:'white',border:'none',borderRadius:'8px',fontSize:'0.875rem',fontWeight:'600',cursor:'pointer'}}>View Detail</button>
<button onClick={()=>handleInputDay(flock)} style={{flex:1,padding:'0.625rem',background:'var(--fw-bg)',color:'var(--fw-text)',border:'1px solid var(--fw-border)',borderRadius:'8px',fontSize:'0.875rem',fontWeight:'600',cursor:'pointer'}}>{t('farmguide.inputData')}</button>
</div>
</div>
);
})}
</div>
)}
</div>
);
const renderAddView=()=>(
<div>
<button onClick={()=>setCurrentView('list')} style={{marginBottom:'1rem',padding:'0.5rem 1rem',background:'var(--fw-bg)',color:'var(--fw-text)',border:'1px solid var(--fw-border)',borderRadius:'8px',cursor:'pointer'}}>← Back to List</button>
<div style={{background:'var(--fw-card)',border:'1px solid var(--fw-border)',borderRadius:'12px',padding:'2rem'}}>
<h2 style={{margin:'0 0 1.5rem',fontSize:'1.5rem',color:'var(--fw-text)'}}>{t('farmguide.addFlockTitle')||'Add New Flock'}</h2>
<form onSubmit={handleSaveFlock}>
<div style={{marginBottom:'1rem'}}>
<label style={{display:'block',marginBottom:'0.5rem',fontSize:'0.875rem',fontWeight:'600',color:'var(--fw-text)'}}>{t('farmguide.flockName')||'House Name'} *</label>
<input type="text" value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} placeholder="e.g., Kandang A1 — Blok Timur" style={{width:'100%',padding:'0.75rem',border:'1px solid var(--fw-border)',borderRadius:'8px',fontSize:'1rem'}} required/>
</div>
<div style={{marginBottom:'1rem'}}>
<label style={{display:'block',marginBottom:'0.5rem',fontSize:'0.875rem',fontWeight:'600',color:'var(--fw-text)'}}>{t('farmguide.placementDate')||'DOC Placement Date'} *</label>
<input type="date" value={formData.placement_date} onChange={e=>setFormData({...formData,placement_date:e.target.value})} style={{width:'100%',padding:'0.75rem',border:'1px solid var(--fw-border)',borderRadius:'8px',fontSize:'1rem'}} required/>
</div>
<div style={{marginBottom:'1rem'}}>
<label style={{display:'block',marginBottom:'0.5rem',fontSize:'0.875rem',fontWeight:'600',color:'var(--fw-text)'}}>{t('farmguide.initialPop')||'Initial Population (birds)'} *</label>
<input type="number" value={formData.initial_pop} onChange={e=>setFormData({...formData,initial_pop:e.target.value})} placeholder="10000" style={{width:'100%',padding:'0.75rem',border:'1px solid var(--fw-border)',borderRadius:'8px',fontSize:'1rem'}} required/>
</div>
{module==='color_chicken'&&(
<>
<div style={{marginBottom:'1rem'}}>
<label style={{display:'block',marginBottom:'0.5rem',fontSize:'0.875rem',fontWeight:'600',color:'var(--fw-text)'}}>Variant *</label>
<select value={formData.variant} onChange={e=>setFormData({...formData,variant:e.target.value})} style={{width:'100%',padding:'0.75rem',border:'1px solid var(--fw-border)',borderRadius:'8px',fontSize:'1rem',background:'white'}}>
<option value="choi">Choi</option>
<option value="mia">Mia</option>
</select>
</div>
<div style={{marginBottom:'1rem'}}>
<label style={{display:'block',marginBottom:'0.5rem',fontSize:'0.875rem',fontWeight:'600',color:'var(--fw-text)'}}>Jenis Kelamin *</label>
<select value={formData.sex} onChange={e=>setFormData({...formData,sex:e.target.value})} style={{width:'100%',padding:'0.75rem',border:'1px solid var(--fw-border)',borderRadius:'8px',fontSize:'1rem',background:'white'}}>
<option value="male">♂ Jantan</option>
<option value="female">♀ Betina</option>
</select>
</div>
</>
)}
<div style={{marginBottom:'1.5rem'}}>
<label style={{display:'block',marginBottom:'0.5rem',fontSize:'0.875rem',fontWeight:'600',color:'var(--fw-text)'}}>{t('farmguide.notes')||'Notes'}</label>
<textarea value={formData.notes} onChange={e=>setFormData({...formData,notes:e.target.value})} rows={3} placeholder="Optional notes..." style={{width:'100%',padding:'0.75rem',border:'1px solid var(--fw-border)',borderRadius:'8px',fontSize:'1rem',fontFamily:'inherit',resize:'vertical'}}/>
</div>
<button type="submit" style={{width:'100%',padding:'0.75rem',background:'var(--fw-teal)',color:'white',border:'none',borderRadius:'8px',fontSize:'1rem',fontWeight:'600',cursor:'pointer'}}>{t('farmguide.saveFlock')||'Save Flock'}</button>
</form>
</div>
</div>
);
const renderDetailView=()=>{
if(!selectedFlock)return null;
const currentDay=getCurrentDay(selectedFlock.placement_date);
const currentWeek=getCurrentWeek(currentDay);
const totalMort=history.reduce((sum,h)=>sum+h.mortality,0);
const currentPop=selectedFlock.initial_pop-totalMort;
return(
<div>
<button onClick={()=>setCurrentView('list')} style={{marginBottom:'1rem',padding:'0.5rem 1rem',background:'var(--fw-bg)',color:'var(--fw-text)',border:'1px solid var(--fw-border)',borderRadius:'8px',cursor:'pointer'}}>← Back to List</button>
<div style={{background:'var(--fw-card)',border:'1px solid var(--fw-border)',borderRadius:'12px',padding:'1.5rem',marginBottom:'1.5rem'}}>
<h2 style={{margin:'0 0 0.5rem',fontSize:'1.5rem',color:'var(--fw-text)'}}>{selectedFlock.name}</h2>
<p style={{margin:'0 0 0.5rem',fontSize:'0.875rem',color:'var(--fw-sub)'}}>
  {selectedFlock.module_id === 'color_chicken'
    ? `Color Chicken${selectedFlock.variant ? ' · ' + selectedFlock.variant.charAt(0).toUpperCase() + selectedFlock.variant.slice(1) : ''}${selectedFlock.sex ? ' · ' + (selectedFlock.sex === 'male' ? '♂' : '♀') : ''}`
    : selectedFlock.module_id === 'broiler' ? 'Broiler Commercial'
    : selectedFlock.module_id === 'layer' ? 'Layer'
    : selectedFlock.module_id === 'parent_stock' ? 'Parent Stock'
    : selectedFlock.module_id}
</p>
<p style={{margin:0,fontSize:'0.875rem',color:'var(--fw-sub)'}}>{t('farmguide.day')} {currentDay} ({t('farmguide.week')} {currentWeek}) · {t('farmguide.population')}: {currentPop.toLocaleString()}</p>
</div>
<div style={{background:'var(--fw-card)',border:'1px solid var(--fw-border)',borderRadius:'12px',padding:'1.5rem',marginBottom:'1.5rem'}}>
<h3 style={{margin:'0 0 1rem',fontSize:'1.125rem',color:'var(--fw-text)'}}>{t('farmguide.performanceChart')||'Performance Chart'}</h3>
{history.length>0?(
<CombinedChart history={history} initialPop={selectedFlock.initial_pop}/>
):(
<p style={{padding:'2rem',textAlign:'center',color:'var(--fw-sub)',background:'var(--fw-bg)',borderRadius:'8px'}}>{t('farmguide.noDataYet')||'No data yet. Start by inputting daily data.'}</p>
)}
</div>
<div style={{background:'var(--fw-card)',border:'1px solid var(--fw-border)',borderRadius:'12px',padding:'1.5rem',marginBottom:'1.5rem'}}>
<DailyMortalityChart history={history} initialPop={selectedFlock.initial_pop}/>
</div>
<div style={{background:'var(--fw-card)',border:'1px solid var(--fw-border)',borderRadius:'12px',padding:'1.5rem',marginBottom:'1.5rem'}}>
<h3 style={{margin:'0 0 1rem',fontSize:'1.125rem',color:'var(--fw-text)'}}>{t('farmguide.historyTitle')||'History'}</h3>
{history.length>0?(
<div style={{overflowX:'auto'}}>
<table style={{width:'100%',borderCollapse:'collapse'}}>
<thead>
<tr style={{background:'var(--fw-bg)'}}>
<th style={{padding:'0.75rem',textAlign:'left',fontSize:'0.875rem',fontWeight:'600',color:'var(--fw-sub)'}}>{t('farmguide.colDay')||'Day'}</th>
<th style={{padding:'0.75rem',textAlign:'right',fontSize:'0.875rem',fontWeight:'600',color:'var(--fw-sub)'}}>{t('farmguide.colBWActual')||'BW Actual'}</th>
<th style={{padding:'0.75rem',textAlign:'right',fontSize:'0.875rem',fontWeight:'600',color:'var(--fw-sub)'}}>{t('farmguide.colBWRange')||'BW Range'}</th>
<th style={{padding:'0.75rem',textAlign:'right',fontSize:'0.875rem',fontWeight:'600',color:'var(--fw-sub)'}}>{t('farmguide.colDiff')||'Diff'}</th>
<th style={{padding:'0.75rem',textAlign:'right',fontSize:'0.875rem',fontWeight:'600',color:'var(--fw-sub)'}}>{t('farmguide.colMortality')||'Mortality'}</th>
<th style={{padding:'0.75rem',textAlign:'center',fontSize:'0.875rem',fontWeight:'600',color:'var(--fw-sub)'}}>{t('farmguide.colStatus')||'Status'}</th>
</tr>
</thead>
<tbody>
{history.filter(h=>h.day&&!isNaN(h.day)&&h.day>=1&&h.day<=56).slice(-10).map((h,i)=>{
let std;
if(module==='color_chicken'){
const rangeData=getColorRange(selectedFlock.variant||'choi',selectedFlock.sex||'male');
std=rangeData.find(r=>r.day===h.day);
}else{
std=BROILER_RANGE.find(r=>r.day===h.day);
}
const getStatus=(bw,s)=>{if(!s||!bw)return'no_data';if(bw<s.bw_low_alert)return'below';if(bw>s.bw_high_alert)return'above';return'on_track';};
const status=getStatus(h.bw_actual_g,std);
const diff=std&&h.bw_actual_g?(h.bw_actual_g-std.bw_avg):null;
const statusCfg=STATUS_CFG(t)[status]||STATUS_CFG(t).no_data;
return(
<tr key={i} style={{borderTop:'1px solid var(--fw-border)'}}>
<td style={{padding:'0.75rem',fontSize:'0.875rem',color:'var(--fw-text)'}}>D{h.day}</td>
<td style={{padding:'0.75rem',textAlign:'right',fontSize:'0.875rem',color:'var(--fw-text)',fontWeight:'600'}}>{h.bw_actual_g?h.bw_actual_g+'g':'—'}</td>
<td style={{padding:'0.75rem',textAlign:'right',fontSize:'0.875rem',color:'var(--fw-sub)'}}>{std?std.bw_low_alert+'–'+std.bw_high_alert+'g':'—'}</td>
<td style={{padding:'0.75rem',textAlign:'right',fontSize:'0.875rem',color:diff&&diff>=0?'#10b981':'var(--fw-orange)',fontWeight:'600'}}>{diff!==null?(diff>=0?'+':'')+diff+'g':'—'}</td>
<td style={{padding:'0.75rem',textAlign:'right',fontSize:'0.875rem',color:'var(--fw-text)'}}>{h.mortality||0}</td>
<td style={{padding:'0.75rem',textAlign:'center',fontSize:'0.75rem',color:statusCfg.color,fontWeight:'600'}}>{statusCfg.label}</td>
</tr>
);
})}
</tbody>
</table>
</div>
):(
<p style={{padding:'1rem',textAlign:'center',color:'var(--fw-sub)',background:'var(--fw-bg)',borderRadius:'8px'}}>{t('farmguide.noHistory')||'No history yet.'}</p>
)}
</div>
<div style={{display:'flex',gap:'1rem'}}>
<button onClick={()=>handleInputDay(selectedFlock)} style={{flex:1,padding:'0.75rem',background:'var(--fw-teal)',color:'white',border:'none',borderRadius:'8px',fontSize:'1rem',fontWeight:'600',cursor:'pointer'}}>{t('farmguide.inputData')}</button>
</div>
</div>
);
};
if(embedded){
return(
<div className="embedded-flock">
{currentView==='list'&&renderListView()}
{currentView==='add'&&renderAddView()}
{currentView==='detail'&&renderDetailView()}
{showDailyEntry&&selectedFlock&&(
<DailyEntry
flock={selectedFlock}
history={history}
onSave={handleSaveEntry}
onClose={()=>setShowDailyEntry(false)}
t={t}
/>
)}
</div>
);
}
return(
<div style={{minHeight:'100vh',background:'var(--fw-bg)'}}>
<SharedTopNav/>
<div style={{maxWidth:'1200px',margin:'0 auto',padding:'2rem 1rem'}}>
{currentView==='list'&&renderListView()}
{currentView==='add'&&renderAddView()}
{currentView==='detail'&&renderDetailView()}
</div>
{showDailyEntry&&selectedFlock&&(
<DailyEntry
flock={selectedFlock}
history={history}
onSave={handleSaveEntry}
onClose={()=>setShowDailyEntry(false)}
t={t}
/>
)}
</div>
);
}
export default FlockSaya;
