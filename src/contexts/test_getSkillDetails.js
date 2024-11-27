import { getSkillDetails, deleteSkill, addSkill, updateSkill } from './FirestoreAPI.js';

const userId = sessionStorage.getItem('userId');;
const skillId = sessionStorage.getItem('skillId');

getSkillDetails(userId, skillId).then(response => {
    console.log('Skill get:', response);
})
.catch(error => {
    console.error('Error:', error);
});