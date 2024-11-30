import{y as p,r as d,j as e,T as s,G as t,z as y}from"./index-s5dWOfUD.js";import{M as C}from"./MainCard-BR8-NKAz.js";import{T as n}from"./TextField-CZDDArwj.js";import{M as o}from"./MenuItem--IlyUJAP.js";import{B as c}from"./OutlinedInput-CvLA6z-P.js";const L=()=>{const{userData:i,updateUserData:b}=p(),[m,u]=d.useState(!1),[a,h]=d.useState({});if(d.useEffect(()=>{i&&h({...i})},[i]),!i)return e.jsx(s,{children:"Loading..."});const x=()=>{u(!m)},r=l=>{const{name:f,value:g}=l.target;h({...a,[f]:g})},v=async l=>{l.preventDefault(),await b(a),u(!1)},j=l=>l instanceof y?l.toDate().toLocaleString():"";return e.jsx(C,{title:"Profile Information",children:m?e.jsx("form",{onSubmit:v,children:e.jsxs(t,{container:!0,spacing:2,children:[e.jsx(t,{item:!0,xs:12,sm:6,children:e.jsx(n,{fullWidth:!0,label:"First Name",name:"firstName",value:a.firstName,onChange:r})}),e.jsx(t,{item:!0,xs:12,sm:6,children:e.jsx(n,{fullWidth:!0,label:"Last Name",name:"lastName",value:a.lastName,onChange:r})}),e.jsx(t,{item:!0,xs:12,sm:6,children:e.jsx(n,{fullWidth:!0,label:"Email",name:"email",value:a.email,onChange:r,disabled:!0})}),e.jsx(t,{item:!0,xs:12,sm:6,children:e.jsx(n,{fullWidth:!0,label:"Phone",name:"phone",value:a.phone,onChange:r})}),e.jsx(t,{item:!0,xs:12,sm:6,children:e.jsxs(n,{select:!0,fullWidth:!0,label:"Gender",name:"gender",value:a.gender,onChange:r,children:[e.jsx(o,{value:"male",children:"Male"}),e.jsx(o,{value:"female",children:"Female"}),e.jsx(o,{value:"other",children:"Other"})]})}),e.jsx(t,{item:!0,xs:12,sm:6,children:e.jsx(n,{fullWidth:!0,type:"date",label:"Birthday",name:"birthday",value:a.birthday,onChange:r,InputLabelProps:{shrink:!0}})}),e.jsx(t,{item:!0,xs:12,sm:6,children:e.jsx(n,{fullWidth:!0,label:"Occupation",name:"occupation",value:a.occupation,onChange:r})}),e.jsx(t,{item:!0,xs:12,sm:6,children:e.jsx(n,{fullWidth:!0,label:"Jobs Seeking",name:"jobsSeeking",value:a.jobsSeeking,onChange:r})}),e.jsx(t,{item:!0,xs:12,sm:6,children:e.jsx(n,{fullWidth:!0,label:"Skills",name:"skills",value:a.skills,onChange:r})}),e.jsxs(t,{item:!0,xs:12,children:[e.jsx(c,{type:"submit",variant:"contained",color:"primary",children:"Save"}),e.jsx(c,{onClick:x,variant:"outlined",color:"secondary",sx:{ml:2},children:"Cancel"})]})]})}):e.jsxs(t,{container:!0,spacing:2,children:[e.jsxs(t,{item:!0,xs:12,sm:6,children:[e.jsx(s,{variant:"subtitle1",children:"First Name:"}),e.jsx(s,{variant:"body1",children:i.firstName})]}),e.jsxs(t,{item:!0,xs:12,sm:6,children:[e.jsx(s,{variant:"subtitle1",children:"Last Name:"}),e.jsx(s,{variant:"body1",children:i.lastName})]}),e.jsxs(t,{item:!0,xs:12,sm:6,children:[e.jsx(s,{variant:"subtitle1",children:"Email:"}),e.jsx(s,{variant:"body1",children:i.email})]}),e.jsxs(t,{item:!0,xs:12,sm:6,children:[e.jsx(s,{variant:"subtitle1",children:"Phone:"}),e.jsx(s,{variant:"body1",children:i.phone})]}),e.jsxs(t,{item:!0,xs:12,sm:6,children:[e.jsx(s,{variant:"subtitle1",children:"Gender:"}),e.jsx(s,{variant:"body1",children:i.gender})]}),e.jsxs(t,{item:!0,xs:12,sm:6,children:[e.jsx(s,{variant:"subtitle1",children:"Birthday:"}),e.jsx(s,{variant:"body1",children:i.birthday})]}),e.jsxs(t,{item:!0,xs:12,sm:6,children:[e.jsx(s,{variant:"subtitle1",children:"Occupation:"}),e.jsx(s,{variant:"body1",children:i.occupation})]}),e.jsxs(t,{item:!0,xs:12,sm:6,children:[e.jsx(s,{variant:"subtitle1",children:"Jobs Seeking:"}),e.jsx(s,{variant:"body1",children:i.jobsSeeking})]}),e.jsxs(t,{item:!0,xs:12,sm:6,children:[e.jsx(s,{variant:"subtitle1",children:"Skills:"}),e.jsx(s,{variant:"body1",children:i.skills})]}),e.jsxs(t,{item:!0,xs:12,sm:6,children:[e.jsx(s,{variant:"subtitle1",children:"Created At:"}),e.jsx(s,{variant:"body1",children:j(i.createdAt)})]}),e.jsxs(t,{item:!0,xs:12,sm:6,children:[e.jsx(s,{variant:"subtitle1",children:"Last Login:"}),e.jsx(s,{variant:"body1",children:j(i.lastLogin)})]}),e.jsx(t,{item:!0,xs:12,children:e.jsx(c,{onClick:x,variant:"contained",color:"primary",children:"Edit Profile"})})]})})};export{L as default};
