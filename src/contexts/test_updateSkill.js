import { getSkillDetails, deleteSkill, addSkill, updateSkill } from './FirestoreAPI.js';

const skill = {
    name: 'test_update2',
    description: 'A programming language',
    related_job: [1, 2, 3],
    related_LM: [4, 5, 6],
    n_LM: 3,
    n_finished: 3,
    status: 1,
    note: '',
}

const userId = sessionStorage.getItem('userId');
const skillId = 'mJ3RWqbbL0Hr6Gkw535I';

updateSkill(userId, skillId, skill).then(response => {
    console.log('Update Skill');
})
.catch(error => {
    console.error('Error:', error);
});