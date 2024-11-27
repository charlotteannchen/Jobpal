import { getSkillDetails, deleteSkill, addSkill, updateSkill } from './FirestoreAPI.js';

const skill = {
    name: '3',
    description: 'A programming language',
    related_job: [1, 2, 3],
    related_LM: [4, 5, 6],
    n_LM: 3,
    n_finished: 3,
    status: false,
    note: '',
}

const userId = 'BEOLCzjnxLRI9OxdNWf5oQjOBC63';

addSkill(userId, skill).then(response => {
    console.log('Skill added with ID:', response.skillId);
})
.catch(error => {
    console.error('Error:', error);
});