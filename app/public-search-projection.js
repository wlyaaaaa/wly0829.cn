// Public search exposes a fixed record shape and preserves surrounding authored text.
const localLiteral=/(?:file:\/+(?:[a-z]:)?|(?<![a-z0-9])[a-z]:[\\/]+|(?<![\\.\w])\\\\(?!\\)[^\\\s]+\\(?!\\))[^\s<>"'，。；！？（）【】,;!?()|`]*/giu;
const internalLiteral=/\b(?:claude-gate-\d+|root_task_id|human_prompt_id|wave\d[a-z]?-(?:current|final)-\d+)\b/giu;
const scalarFields=['type','group','projectSlug','title','href','detail','search'];
const listFields=['aliases','scopes'];

export function publicSearchText(value){
  return String(value??'').replace(localLiteral,'（本机路径）').replace(internalLiteral,'（本机路径）');
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
