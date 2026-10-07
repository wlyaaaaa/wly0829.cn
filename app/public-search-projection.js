// Public search exposes a fixed record shape and preserves surrounding authored text.
const scalarFields=['type','group','projectSlug','title','href','detail','search'];
const listFields=['aliases','scopes'];

export function publicSearchText(value){
  return String(value??'');
}

export function publicSearchRecord(entry){
  const record={};
  for(const field of scalarFields){
    if(!(field in entry))continue;
    const value=entry[field];
    if(value!==null&&typeof value==='object')throw new Error('Undeclared nested search field: '+field);
    record[field]=typeof value==='string'?publicSearchText(value):value;
  }
  for(const field of listFields){
    if(!(field in entry))continue;
    if(!Array.isArray(entry[field])||entry[field].some(value=>typeof value!=='string'))throw new Error('Search list must contain text: '+field);
    record[field]=entry[field].map(publicSearchText);
  }
  return record;
}
