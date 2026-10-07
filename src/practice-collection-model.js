export const PRACTICE_CATEGORIES = Object.freeze({words:'Words · 単語',phrases:'Phrases · フレーズ',phonics:'Phonics · フォニックス'});
export const PRACTICE_RATINGS = Object.freeze({hard:'Hard · 難しい',good:'Good · できた',easy:'Easy · 簡単'});

export function practicedRows(rows,allowedCategories=Object.keys(PRACTICE_CATEGORIES)) {
  return rows.filter(row=>row.item?.active!==false && allowedCategories.includes(row.item?.category)
    && (Number(row.review_count)>0||row.last_reviewed_at||PRACTICE_RATINGS[row.self_rating]))
    .sort((a,b)=>String(b.last_reviewed_at||b.updated_at||'').localeCompare(String(a.last_reviewed_at||a.updated_at||''))||String(a.item_id).localeCompare(String(b.item_id)));
}
export function filterPractice(rows,{category='all',rating='all',level='all',search=''}={}) {
  const query=search.trim().normalize('NFKC').toLowerCase();
  return rows.filter(row=>(category==='all'||row.item.category===category)
    &&(rating==='all'||row.self_rating===rating)
    &&(level==='all'||Number(row.item.level)===Number(level))
    &&(!query||`${row.item.title_en} ${row.item.title_ja} ${JSON.stringify(row.item.content||{})}`.normalize('NFKC').toLowerCase().includes(query)));
}
export function curriculumItemHref(item) {
  return `/learn?category=${encodeURIComponent(item.category)}&level=${Number(item.level)}&item=${encodeURIComponent(item.id)}`;
}
