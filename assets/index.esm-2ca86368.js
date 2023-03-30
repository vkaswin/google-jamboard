import{R as J}from"./index-7d2d302a.js";var le=e=>e.type==="checkbox",ee=e=>e instanceof Date,O=e=>e==null;const Ge=e=>typeof e=="object";var m=e=>!O(e)&&!Array.isArray(e)&&Ge(e)&&!ee(e),dr=e=>m(e)&&e.target?le(e.target)?e.target.checked:e.target.value:e,yr=e=>e.substring(0,e.search(/\.\d+(\.|$)/))||e,hr=(e,i)=>e.has(yr(i)),gr=e=>{const i=e.constructor&&e.constructor.prototype;return m(i)&&i.hasOwnProperty("isPrototypeOf")},Ee=typeof window<"u"&&typeof window.HTMLElement<"u"&&typeof document<"u";function G(e){let i;const s=Array.isArray(e);if(e instanceof Date)i=new Date(e);else if(e instanceof Set)i=new Set(e);else if(!(Ee&&(e instanceof Blob||e instanceof FileList))&&(s||m(e)))if(i=s?[]:{},!Array.isArray(e)&&!gr(e))i=e;else for(const t in e)i[t]=G(e[t]);else return e;return i}var ae=e=>Array.isArray(e)?e.filter(Boolean):[],k=e=>e===void 0,d=(e,i,s)=>{if(!i||!m(e))return s;const t=ae(i.split(/[,[\].]+?/)).reduce((u,a)=>O(u)?u:u[a],e);return k(t)||t===e?k(e[i])?s:e[i]:t};const Ie={BLUR:"blur",FOCUS_OUT:"focusout",CHANGE:"change"},N={onBlur:"onBlur",onChange:"onChange",onSubmit:"onSubmit",onTouched:"onTouched",all:"all"},W={max:"max",min:"min",maxLength:"maxLength",minLength:"minLength",pattern:"pattern",required:"required",validate:"validate"};J.createContext(null);var vr=(e,i,s,t=!0)=>{const u={defaultValues:i._defaultValues};for(const a in e)Object.defineProperty(u,a,{get:()=>{const y=a;return i._proxyFormState[y]!==N.all&&(i._proxyFormState[y]=!t||N.all),s&&(s[y]=!0),e[y]}});return u},U=e=>m(e)&&!Object.keys(e).length,Ar=(e,i,s,t)=>{s(e);const{name:u,...a}=e;return U(a)||Object.keys(a).length>=Object.keys(i).length||Object.keys(a).find(y=>i[y]===(!t||N.all))},Fe=e=>Array.isArray(e)?e:[e];function Vr(e){const i=J.useRef(e);i.current=e,J.useEffect(()=>{const s=!e.disabled&&i.current.subject&&i.current.subject.subscribe({next:i.current.next});return()=>{s&&s.unsubscribe()}},[e.disabled])}var P=e=>typeof e=="string",_r=(e,i,s,t,u)=>P(e)?(t&&i.watch.add(e),d(s,e,u)):Array.isArray(e)?e.map(a=>(t&&i.watch.add(a),d(s,a))):(t&&(i.watchAll=!0),s),pe=e=>/^\w*$/.test(e),Je=e=>ae(e.replace(/["|']|\]/g,"").split(/\.|\[/));function x(e,i,s){let t=-1;const u=pe(i)?[i]:Je(i),a=u.length,y=a-1;for(;++t<a;){const b=u[t];let _=s;if(t!==y){const L=e[b];_=m(L)||Array.isArray(L)?L:isNaN(+u[t+1])?{}:[]}e[b]=_,e=e[b]}return e}var br=(e,i,s,t,u)=>i?{...s[e],types:{...s[e]&&s[e].types?s[e].types:{},[t]:u||!0}}:{};const me=(e,i,s)=>{for(const t of s||Object.keys(e)){const u=d(e,t);if(u){const{_f:a,...y}=u;if(a&&i(a.name)){if(a.ref.focus){a.ref.focus();break}else if(a.refs&&a.refs[0].focus){a.refs[0].focus();break}}else m(y)&&me(y,i)}}};var Pe=e=>({isOnSubmit:!e||e===N.onSubmit,isOnBlur:e===N.onBlur,isOnChange:e===N.onChange,isOnAll:e===N.all,isOnTouch:e===N.onTouched}),qe=(e,i,s)=>!s&&(i.watchAll||i.watch.has(e)||[...i.watch].some(t=>e.startsWith(t)&&/^\.\w+/.test(e.slice(t.length)))),xr=(e,i,s)=>{const t=ae(d(e,s));return x(t,"root",i[s]),x(e,s,t),e},re=e=>typeof e=="boolean",Oe=e=>e.type==="file",K=e=>typeof e=="function",ce=e=>{if(!Ee)return!1;const i=e?e.ownerDocument:0;return e instanceof(i&&i.defaultView?i.defaultView.HTMLElement:HTMLElement)},fe=e=>P(e),Te=e=>e.type==="radio",de=e=>e instanceof RegExp;const He={value:!1,isValid:!1},We={value:!0,isValid:!0};var Qe=e=>{if(Array.isArray(e)){if(e.length>1){const i=e.filter(s=>s&&s.checked&&!s.disabled).map(s=>s.value);return{value:i,isValid:!!i.length}}return e[0].checked&&!e[0].disabled?e[0].attributes&&!k(e[0].attributes.value)?k(e[0].value)||e[0].value===""?We:{value:e[0].value,isValid:!0}:We:He}return He};const $e={isValid:!1,value:null};var Xe=e=>Array.isArray(e)?e.reduce((i,s)=>s&&s.checked&&!s.disabled?{isValid:!0,value:s.value}:i,$e):$e;function Ke(e,i,s="validate"){if(fe(e)||Array.isArray(e)&&e.every(fe)||re(e)&&!e)return{type:s,message:fe(e)?e:"",ref:i}}var Z=e=>m(e)&&!de(e)?e:{value:e,message:""},je=async(e,i,s,t,u)=>{const{ref:a,refs:y,required:b,maxLength:_,minLength:L,min:X,max:S,pattern:A,validate:$,name:C,valueAsNumber:ge,mount:oe,disabled:ve}=e._f,g=d(i,C);if(!oe||ve)return{};const M=y?y[0]:a,q=V=>{t&&M.reportValidity&&(M.setCustomValidity(re(V)?"":V||""),M.reportValidity())},E={},te=Te(a),se=le(a),Ae=te||se,B=(ge||Oe(a))&&k(a.value)&&k(g)||ce(a)&&a.value===""||g===""||Array.isArray(g)&&!g.length,j=br.bind(null,C,s,E),H=(V,v,w,T=W.maxLength,R=W.minLength)=>{const I=V?v:w;E[C]={type:V?T:R,message:I,ref:a,...j(V?T:R,I)}};if(u?!Array.isArray(g)||!g.length:b&&(!Ae&&(B||O(g))||re(g)&&!g||se&&!Qe(y).isValid||te&&!Xe(y).isValid)){const{value:V,message:v}=fe(b)?{value:!!b,message:b}:Z(b);if(V&&(E[C]={type:W.required,message:v,ref:M,...j(W.required,v)},!s))return q(v),E}if(!B&&(!O(X)||!O(S))){let V,v;const w=Z(S),T=Z(X);if(!O(g)&&!isNaN(g)){const R=a.valueAsNumber||g&&+g;O(w.value)||(V=R>w.value),O(T.value)||(v=R<T.value)}else{const R=a.valueAsDate||new Date(g),I=ne=>new Date(new Date().toDateString()+" "+ne),z=a.type=="time",ie=a.type=="week";P(w.value)&&g&&(V=z?I(g)>I(w.value):ie?g>w.value:R>new Date(w.value)),P(T.value)&&g&&(v=z?I(g)<I(T.value):ie?g<T.value:R<new Date(T.value))}if((V||v)&&(H(!!V,w.message,T.message,W.max,W.min),!s))return q(E[C].message),E}if((_||L)&&!B&&(P(g)||u&&Array.isArray(g))){const V=Z(_),v=Z(L),w=!O(V.value)&&g.length>+V.value,T=!O(v.value)&&g.length<+v.value;if((w||T)&&(H(w,V.message,v.message),!s))return q(E[C].message),E}if(A&&!B&&P(g)){const{value:V,message:v}=Z(A);if(de(V)&&!g.match(V)&&(E[C]={type:W.pattern,message:v,ref:a,...j(W.pattern,v)},!s))return q(v),E}if($){if(K($)){const V=await $(g,i),v=Ke(V,M);if(v&&(E[C]={...v,...j(W.validate,v.message)},!s))return q(v.message),E}else if(m($)){let V={};for(const v in $){if(!U(V)&&!s)break;const w=Ke(await $[v](g,i),M,v);w&&(V={...w,...j(v,w.message)},q(w.message),s&&(E[C]=V))}if(!U(V)&&(E[C]={ref:M,...V},!s))return E}}return q(!0),E};function Fr(e,i){const s=i.slice(0,-1).length;let t=0;for(;t<s;)e=k(e)?t++:e[i[t++]];return e}function wr(e){for(const i in e)if(!k(e[i]))return!1;return!0}function p(e,i){const s=Array.isArray(i)?i:pe(i)?[i]:Je(i),t=s.length===1?e:Fr(e,s),u=s.length-1,a=s[u];return t&&delete t[a],u!==0&&(m(t)&&U(t)||Array.isArray(t)&&wr(t))&&p(e,s.slice(0,-1)),e}function we(){let e=[];return{get observers(){return e},next:u=>{for(const a of e)a.next&&a.next(u)},subscribe:u=>(e.push(u),{unsubscribe:()=>{e=e.filter(a=>a!==u)}}),unsubscribe:()=>{e=[]}}}var ye=e=>O(e)||!Ge(e);function Q(e,i){if(ye(e)||ye(i))return e===i;if(ee(e)&&ee(i))return e.getTime()===i.getTime();const s=Object.keys(e),t=Object.keys(i);if(s.length!==t.length)return!1;for(const u of s){const a=e[u];if(!t.includes(u))return!1;if(u!=="ref"){const y=i[u];if(ee(a)&&ee(y)||m(a)&&m(y)||Array.isArray(a)&&Array.isArray(y)?!Q(a,y):a!==y)return!1}}return!0}var Ye=e=>e.type==="select-multiple",Dr=e=>Te(e)||le(e),De=e=>ce(e)&&e.isConnected,Ze=e=>{for(const i in e)if(K(e[i]))return!0;return!1};function he(e,i={}){const s=Array.isArray(e);if(m(e)||s)for(const t in e)Array.isArray(e[t])||m(e[t])&&!Ze(e[t])?(i[t]=Array.isArray(e[t])?[]:{},he(e[t],i[t])):O(e[t])||(i[t]=!0);return i}function er(e,i,s){const t=Array.isArray(e);if(m(e)||t)for(const u in e)Array.isArray(e[u])||m(e[u])&&!Ze(e[u])?k(i)||ye(s[u])?s[u]=Array.isArray(e[u])?he(e[u],[]):{...he(e[u])}:er(e[u],O(i)?{}:i[u],s[u]):s[u]=!Q(e[u],i[u]);return s}var ke=(e,i)=>er(e,i,he(i)),rr=(e,{valueAsNumber:i,valueAsDate:s,setValueAs:t})=>k(e)?e:i?e===""?NaN:e&&+e:s&&P(e)?new Date(e):t?t(e):e;function Se(e){const i=e.ref;if(!(e.refs?e.refs.every(s=>s.disabled):i.disabled))return Oe(i)?i.files:Te(i)?Xe(e.refs).value:Ye(i)?[...i.selectedOptions].map(({value:s})=>s):le(i)?Qe(e.refs).value:rr(k(i.value)?e.ref.value:i.value,e)}var kr=(e,i,s,t)=>{const u={};for(const a of e){const y=d(i,a);y&&x(u,a,y._f)}return{criteriaMode:s,names:[...e],fields:u,shouldUseNativeValidation:t}},ue=e=>k(e)?e:de(e)?e.source:m(e)?de(e.value)?e.value.source:e.value:e,Sr=e=>e.mount&&(e.required||e.min||e.max||e.maxLength||e.minLength||e.pattern||e.validate);function ze(e,i,s){const t=d(e,s);if(t||pe(s))return{error:t,name:s};const u=s.split(".");for(;u.length;){const a=u.join("."),y=d(i,a),b=d(e,a);if(y&&!Array.isArray(y)&&s!==a)return{name:s};if(b&&b.type)return{name:a,error:b};u.pop()}return{name:s}}var mr=(e,i,s,t,u)=>u.isOnAll?!1:!s&&u.isOnTouch?!(i||e):(s?t.isOnBlur:u.isOnBlur)?!e:(s?t.isOnChange:u.isOnChange)?e:!0,Er=(e,i)=>!ae(d(e,i)).length&&p(e,i);const pr={mode:N.onSubmit,reValidateMode:N.onChange,shouldFocusError:!0};function Or(e={},i){let s={...pr,...e},t={submitCount:0,isDirty:!1,isLoading:K(s.defaultValues),isValidating:!1,isSubmitted:!1,isSubmitting:!1,isSubmitSuccessful:!1,isValid:!1,touchedFields:{},dirtyFields:{},errors:{}},u={},a=m(s.defaultValues)||m(s.values)?G(s.defaultValues||s.values)||{}:{},y=s.shouldUnregister?{}:G(a),b={action:!1,mount:!1,watch:!1},_={mount:new Set,unMount:new Set,array:new Set,watch:new Set},L,X=0;const S={isDirty:!1,dirtyFields:!1,touchedFields:!1,isValidating:!1,isValid:!1,errors:!1},A={values:we(),array:we(),state:we()},$=e.resetOptions&&e.resetOptions.keepDirtyValues,C=Pe(s.mode),ge=Pe(s.reValidateMode),oe=s.criteriaMode===N.all,ve=r=>n=>{clearTimeout(X),X=setTimeout(r,n)},g=async r=>{if(S.isValid||r){const n=s.resolver?U((await B()).errors):await H(u,!0);n!==t.isValid&&A.state.next({isValid:n})}},M=r=>S.isValidating&&A.state.next({isValidating:r}),q=(r,n=[],l,c,f=!0,o=!0)=>{if(c&&l){if(b.action=!0,o&&Array.isArray(d(u,r))){const h=l(d(u,r),c.argA,c.argB);f&&x(u,r,h)}if(o&&Array.isArray(d(t.errors,r))){const h=l(d(t.errors,r),c.argA,c.argB);f&&x(t.errors,r,h),Er(t.errors,r)}if(S.touchedFields&&o&&Array.isArray(d(t.touchedFields,r))){const h=l(d(t.touchedFields,r),c.argA,c.argB);f&&x(t.touchedFields,r,h)}S.dirtyFields&&(t.dirtyFields=ke(a,y)),A.state.next({name:r,isDirty:v(r,n),dirtyFields:t.dirtyFields,errors:t.errors,isValid:t.isValid})}else x(y,r,n)},E=(r,n)=>{x(t.errors,r,n),A.state.next({errors:t.errors})},te=(r,n,l,c)=>{const f=d(u,r);if(f){const o=d(y,r,k(l)?d(a,r):l);k(o)||c&&c.defaultChecked||n?x(y,r,n?o:Se(f._f)):R(r,o),b.mount&&g()}},se=(r,n,l,c,f)=>{let o=!1,h=!1;const F={name:r};if(!l||c){S.isDirty&&(h=t.isDirty,t.isDirty=F.isDirty=v(),o=h!==F.isDirty);const D=Q(d(a,r),n);h=d(t.dirtyFields,r),D?p(t.dirtyFields,r):x(t.dirtyFields,r,!0),F.dirtyFields=t.dirtyFields,o=o||S.dirtyFields&&h!==!D}if(l){const D=d(t.touchedFields,r);D||(x(t.touchedFields,r,l),F.touchedFields=t.touchedFields,o=o||S.touchedFields&&D!==l)}return o&&f&&A.state.next(F),o?F:{}},Ae=(r,n,l,c)=>{const f=d(t.errors,r),o=S.isValid&&re(n)&&t.isValid!==n;if(e.delayError&&l?(L=ve(()=>E(r,l)),L(e.delayError)):(clearTimeout(X),L=null,l?x(t.errors,r,l):p(t.errors,r)),(l?!Q(f,l):f)||!U(c)||o){const h={...c,...o&&re(n)?{isValid:n}:{},errors:t.errors,name:r};t={...t,...h},A.state.next(h)}M(!1)},B=async r=>s.resolver(y,s.context,kr(r||_.mount,u,s.criteriaMode,s.shouldUseNativeValidation)),j=async r=>{const{errors:n}=await B();if(r)for(const l of r){const c=d(n,l);c?x(t.errors,l,c):p(t.errors,l)}else t.errors=n;return n},H=async(r,n,l={valid:!0})=>{for(const c in r){const f=r[c];if(f){const{_f:o,...h}=f;if(o){const F=_.array.has(o.name),D=await je(f,y,oe,s.shouldUseNativeValidation&&!n,F);if(D[o.name]&&(l.valid=!1,n))break;!n&&(d(D,o.name)?F?xr(t.errors,D,o.name):x(t.errors,o.name,D[o.name]):p(t.errors,o.name))}h&&await H(h,n,l)}}return l.valid},V=()=>{for(const r of _.unMount){const n=d(u,r);n&&(n._f.refs?n._f.refs.every(l=>!De(l)):!De(n._f.ref))&&Ve(r)}_.unMount=new Set},v=(r,n)=>(r&&n&&x(y,r,n),!Q(Le(),a)),w=(r,n,l)=>_r(r,_,{...b.mount?y:k(n)?a:P(r)?{[r]:n}:n},l,n),T=r=>ae(d(b.mount?y:a,r,e.shouldUnregister?d(a,r,[]):[])),R=(r,n,l={})=>{const c=d(u,r);let f=n;if(c){const o=c._f;o&&(!o.disabled&&x(y,r,rr(n,o)),f=ce(o.ref)&&O(n)?"":n,Ye(o.ref)?[...o.ref.options].forEach(h=>h.selected=f.includes(h.value)):o.refs?le(o.ref)?o.refs.length>1?o.refs.forEach(h=>(!h.defaultChecked||!h.disabled)&&(h.checked=Array.isArray(f)?!!f.find(F=>F===h.value):f===h.value)):o.refs[0]&&(o.refs[0].checked=!!f):o.refs.forEach(h=>h.checked=h.value===f):Oe(o.ref)?o.ref.value="":(o.ref.value=f,o.ref.type||A.values.next({name:r,values:{...y}})))}(l.shouldDirty||l.shouldTouch)&&se(r,f,l.shouldTouch,l.shouldDirty,!0),l.shouldValidate&&ne(r)},I=(r,n,l)=>{for(const c in n){const f=n[c],o=`${r}.${c}`,h=d(u,o);(_.array.has(r)||!ye(f)||h&&!h._f)&&!ee(f)?I(o,f,l):R(o,f,l)}},z=(r,n,l={})=>{const c=d(u,r),f=_.array.has(r),o=G(n);x(y,r,o),f?(A.array.next({name:r,values:{...y}}),(S.isDirty||S.dirtyFields)&&l.shouldDirty&&A.state.next({name:r,dirtyFields:ke(a,y),isDirty:v(r,o)})):c&&!c._f&&!O(o)?I(r,o,l):R(r,o,l),qe(r,_)&&A.state.next({...t}),A.values.next({name:r,values:{...y}}),!b.mount&&i()},ie=async r=>{const n=r.target;let l=n.name,c=!0;const f=d(u,l),o=()=>n.type?Se(f._f):dr(r);if(f){let h,F;const D=o(),Y=r.type===Ie.BLUR||r.type===Ie.FOCUS_OUT,or=!Sr(f._f)&&!s.resolver&&!d(t.errors,l)&&!f._f.deps||mr(Y,d(t.touchedFields,l),t.isSubmitted,ge,C),be=qe(l,_,Y);x(y,l,D),Y?(f._f.onBlur&&f._f.onBlur(r),L&&L(0)):f._f.onChange&&f._f.onChange(r);const xe=se(l,D,Y,!1),fr=!U(xe)||be;if(!Y&&A.values.next({name:l,type:r.type,values:{...y}}),or)return S.isValid&&g(),fr&&A.state.next({name:l,...be?{}:xe});if(!Y&&be&&A.state.next({...t}),M(!0),s.resolver){const{errors:Ne}=await B([l]),cr=ze(t.errors,u,l),Be=ze(Ne,u,cr.name||l);h=Be.error,l=Be.name,F=U(Ne)}else h=(await je(f,y,oe,s.shouldUseNativeValidation))[l],c=isNaN(D)||D===d(y,l,D),c&&(h?F=!1:S.isValid&&(F=await H(u,!0)));c&&(f._f.deps&&ne(f._f.deps),Ae(l,F,h,xe))}},ne=async(r,n={})=>{let l,c;const f=Fe(r);if(M(!0),s.resolver){const o=await j(k(r)?r:f);l=U(o),c=r?!f.some(h=>d(o,h)):l}else r?(c=(await Promise.all(f.map(async o=>{const h=d(u,o);return await H(h&&h._f?{[o]:h}:h)}))).every(Boolean),!(!c&&!t.isValid)&&g()):c=l=await H(u);return A.state.next({...!P(r)||S.isValid&&l!==t.isValid?{}:{name:r},...s.resolver||!r?{isValid:l}:{},errors:t.errors,isValidating:!1}),n.shouldFocus&&!c&&me(u,o=>o&&d(t.errors,o),r?f:_.mount),c},Le=r=>{const n={...a,...b.mount?y:{}};return k(r)?n:P(r)?d(n,r):r.map(l=>d(n,l))},Ce=(r,n)=>({invalid:!!d((n||t).errors,r),isDirty:!!d((n||t).dirtyFields,r),isTouched:!!d((n||t).touchedFields,r),error:d((n||t).errors,r)}),tr=r=>{r&&Fe(r).forEach(n=>p(t.errors,n)),A.state.next({errors:r?t.errors:{}})},sr=(r,n,l)=>{const c=(d(u,r,{_f:{}})._f||{}).ref;x(t.errors,r,{...n,ref:c}),A.state.next({name:r,errors:t.errors,isValid:!1}),l&&l.shouldFocus&&c&&c.focus&&c.focus()},ir=(r,n)=>K(r)?A.values.subscribe({next:l=>r(w(void 0,n),l)}):w(r,n,!0),Ve=(r,n={})=>{for(const l of r?Fe(r):_.mount)_.mount.delete(l),_.array.delete(l),n.keepValue||(p(u,l),p(y,l)),!n.keepError&&p(t.errors,l),!n.keepDirty&&p(t.dirtyFields,l),!n.keepTouched&&p(t.touchedFields,l),!s.shouldUnregister&&!n.keepDefaultValue&&p(a,l);A.values.next({values:{...y}}),A.state.next({...t,...n.keepDirty?{isDirty:v()}:{}}),!n.keepIsValid&&g()},_e=(r,n={})=>{let l=d(u,r);const c=re(n.disabled);return x(u,r,{...l||{},_f:{...l&&l._f?l._f:{ref:{name:r}},name:r,mount:!0,...n}}),_.mount.add(r),l?c&&x(y,r,n.disabled?void 0:d(y,r,Se(l._f))):te(r,!0,n.value),{...c?{disabled:n.disabled}:{},...s.shouldUseNativeValidation?{required:!!n.required,min:ue(n.min),max:ue(n.max),minLength:ue(n.minLength),maxLength:ue(n.maxLength),pattern:ue(n.pattern)}:{},name:r,onChange:ie,onBlur:ie,ref:f=>{if(f){_e(r,n),l=d(u,r);const o=k(f.value)&&f.querySelectorAll&&f.querySelectorAll("input,select,textarea")[0]||f,h=Dr(o),F=l._f.refs||[];if(h?F.find(D=>D===o):o===l._f.ref)return;x(u,r,{_f:{...l._f,...h?{refs:[...F.filter(De),o,...Array.isArray(d(a,r))?[{}]:[]],ref:{type:o.type,name:r}}:{ref:o}}}),te(r,!1,void 0,o)}else l=d(u,r,{}),l._f&&(l._f.mount=!1),(s.shouldUnregister||n.shouldUnregister)&&!(hr(_.array,r)&&b.action)&&_.unMount.add(r)}}},Re=()=>s.shouldFocusError&&me(u,r=>r&&d(t.errors,r),_.mount),nr=(r,n)=>async l=>{l&&(l.preventDefault&&l.preventDefault(),l.persist&&l.persist());let c=G(y);if(A.state.next({isSubmitting:!0}),s.resolver){const{errors:f,values:o}=await B();t.errors=f,c=o}else await H(u);p(t.errors,"root"),U(t.errors)?(A.state.next({errors:{}}),await r(c,l)):(n&&await n({...t.errors},l),Re(),setTimeout(Re)),A.state.next({isSubmitted:!0,isSubmitting:!1,isSubmitSuccessful:U(t.errors),submitCount:t.submitCount+1,errors:t.errors})},ur=(r,n={})=>{d(u,r)&&(k(n.defaultValue)?z(r,d(a,r)):(z(r,n.defaultValue),x(a,r,n.defaultValue)),n.keepTouched||p(t.touchedFields,r),n.keepDirty||(p(t.dirtyFields,r),t.isDirty=n.defaultValue?v(r,d(a,r)):v()),n.keepError||(p(t.errors,r),S.isValid&&g()),A.state.next({...t}))},Ue=(r,n={})=>{const l=r||a,c=G(l),f=r&&!U(r)?c:a;if(n.keepDefaultValues||(a=l),!n.keepValues){if(n.keepDirtyValues||$)for(const o of _.mount)d(t.dirtyFields,o)?x(f,o,d(y,o)):z(o,d(f,o));else{if(Ee&&k(r))for(const o of _.mount){const h=d(u,o);if(h&&h._f){const F=Array.isArray(h._f.refs)?h._f.refs[0]:h._f.ref;if(ce(F)){const D=F.closest("form");if(D){D.reset();break}}}}u={}}y=e.shouldUnregister?n.keepDefaultValues?G(a):{}:c,A.array.next({values:{...f}}),A.values.next({values:{...f}})}_={mount:new Set,unMount:new Set,array:new Set,watch:new Set,watchAll:!1,focus:""},!b.mount&&i(),b.mount=!S.isValid||!!n.keepIsValid,b.watch=!!e.shouldUnregister,A.state.next({submitCount:n.keepSubmitCount?t.submitCount:0,isDirty:n.keepDirty?t.isDirty:!!(n.keepDefaultValues&&!Q(r,a)),isSubmitted:n.keepIsSubmitted?t.isSubmitted:!1,dirtyFields:n.keepDirtyValues?t.dirtyFields:n.keepDefaultValues&&r?ke(a,r):{},touchedFields:n.keepTouched?t.touchedFields:{},errors:n.keepErrors?t.errors:{},isSubmitting:!1,isSubmitSuccessful:!1})},Me=(r,n)=>Ue(K(r)?r(y):r,n),lr=(r,n={})=>{const l=d(u,r),c=l&&l._f;if(c){const f=c.refs?c.refs[0]:c.ref;f.focus&&(f.focus(),n.shouldSelect&&f.select())}},ar=r=>{t={...t,...r}};return K(s.defaultValues)&&s.defaultValues().then(r=>{Me(r,s.resetOptions),A.state.next({isLoading:!1})}),{control:{register:_e,unregister:Ve,getFieldState:Ce,_executeSchema:B,_getWatch:w,_getDirty:v,_updateValid:g,_removeUnmounted:V,_updateFieldArray:q,_getFieldArray:T,_reset:Ue,_updateFormState:ar,_subjects:A,_proxyFormState:S,get _fields(){return u},get _formValues(){return y},get _state(){return b},set _state(r){b=r},get _defaultValues(){return a},get _names(){return _},set _names(r){_=r},get _formState(){return t},set _formState(r){t=r},get _options(){return s},set _options(r){s={...s,...r}}},trigger:ne,register:_e,handleSubmit:nr,watch:ir,setValue:z,getValues:Le,reset:Me,resetField:ur,clearErrors:tr,unregister:Ve,setError:sr,setFocus:lr,getFieldState:Ce}}function Lr(e={}){const i=J.useRef(),[s,t]=J.useState({isDirty:!1,isValidating:!1,isLoading:K(e.defaultValues),isSubmitted:!1,isSubmitting:!1,isSubmitSuccessful:!1,isValid:!1,submitCount:0,dirtyFields:{},touchedFields:{},errors:{},defaultValues:K(e.defaultValues)?void 0:e.defaultValues});i.current||(i.current={...Or(e,()=>t(a=>({...a}))),formState:s});const u=i.current.control;return u._options=e,Vr({subject:u._subjects.state,next:a=>{Ar(a,u._proxyFormState,u._updateFormState,!0)&&t({...u._formState})}}),J.useEffect(()=>{e.values&&!Q(e.values,u._defaultValues)&&u._reset(e.values,u._options.resetOptions)},[e.values,u]),J.useEffect(()=>{u._state.mount||(u._updateValid(),u._state.mount=!0),u._state.watch&&(u._state.watch=!1,u._subjects.state.next({...u._formState})),u._removeUnmounted()}),i.current.formState=vr(s,u),i.current}export{Lr as u};
