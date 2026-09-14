import {escapeHTML as e} from './store.js?v=20260911-mobile2';
export function confirmNoteAction(message) {
 return new Promise(resolve=>{const dialog=document.createElement('dialog');dialog.className='ln-modal ln-confirm';dialog.innerHTML=`<h2>Confirm this change · 操作を確認</h2><p>${e(message)}</p><div class="ln-actions"><button type="button" class="ln-button" data-yes>Continue · 実行する</button><button type="button" class="ln-button" data-no>Cancel · キャンセル</button></div>`;let accepted=false;dialog.querySelector('[data-yes]').onclick=()=>{accepted=true;dialog.close();};dialog.querySelector('[data-no]').onclick=()=>dialog.close();dialog.onclose=()=>{dialog.remove();resolve(accepted);};document.body.append(dialog);dialog.showModal();dialog.querySelector('[data-no]').focus();});
}
