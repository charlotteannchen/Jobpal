import { getSkillDetails, deleteSkill, addSkill, updateSkill } from './FirestoreAPI.js';

const userId = 'BEOLCzjnxLRI9OxdNWf5oQjOBC63';
const skillId = '5LLhM8X6HJZlVxzua6rI';

getSkillDetails(userId, skillId).then(response => {
    console.log('Skill get:', response);
})
.catch(error => {
    console.error('Error:', error);
});