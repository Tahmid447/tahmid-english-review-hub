import {getSettings,onSettingsChange,updateSettings} from './store.js';

export function mountExerciseDisplay(host,{onSelect=style=>updateSettings({exerciseStyle:style})}={}) {
 const control=document.createElement('div');control.className='exercise-display';
 control.setAttribute('role','group');control.setAttribute('aria-label','Practice appearance · 演習の表示');
 control.innerHTML='<span>Practice style · 演習スタイル</span><div class="exercise-style-options"><button type="button" data-exercise-style="classic" title="Original appearance · これまでの表示">Classic</button><button type="button" data-exercise-style="color" title="Colorful practice · カラフルな演習">Color</button><button type="button" data-exercise-style="focus" title="Quiet, focused practice · 集中できる表示">Focus</button></div>';
 const paint=settings=>{
  const style=settings.exerciseStyle||'color';document.documentElement.dataset.exerciseStyle=style;
  control.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.exerciseStyle===style)));
 };
 control.addEventListener('click',event=>{const button=event.target.closest('[data-exercise-style]');if(button)onSelect(button.dataset.exerciseStyle);});
 host.append(control);paint(getSettings());const dispose=onSettingsChange(paint);
 return ()=>{dispose();control.remove();};
}
