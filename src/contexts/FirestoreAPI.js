import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, getDocs, getDoc, query, where, updateDoc, deleteDoc } from 'firebase/firestore';

// Firebase configuration
// firebaseConfig 是 Firebase 項目配置對象，從環境變量加載敏感信息。
// 確保環境變量已正確配置，例如 .env 文件中的 VITE_APP_FIREBASE_API_KEY。
const firebaseConfig = {
    apiKey: 'AIzaSyB1BU5CeOtt7NYUYNcSL16DlVntUnvTCdU',
    authDomain: 'jobpal-2ee1f.firebaseapp.com',
    projectId: 'jobpal-2ee1f',
    storageBucket: 'jobpal-2ee1f.firebasestorage.app',
    messagingSenderId: '1019457227078',
    appId: '1:1019457227078:web:a96f325c535dd45f833d47',
    measurementId: 'G-41ZPEVZJM0'
};

// 初始化 Firebase Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==============================|| job API ||============================== //
export const getJobDetails = async (uid, jobId) => {
    try {
        const jobDocRef = doc(db, 'users', uid, 'jobs', jobId);
        const jobDoc = await getDoc(jobDocRef);

        if (jobDoc.exists()) {
            return jobDoc.data();
        } else {
            throw new Error('Job not found');
        }
    } catch (error) {
        console.error('Error fetching job details:', error);
        throw error;
    }
};

export const deleteJob = async (uid, jobId) => {
    if (!uid || !jobId) {
        console.error('Invalid parameters: uid or jobId is missing');
        return 0; // 明確回傳失敗代碼
    }

    try {
        const jobDocRef = doc(db, 'users', uid, 'jobs', jobId);
        await deleteDoc(jobDocRef);
        console.log(`Job with ID ${jobId} deleted successfully`);
        return 1; // 明確回傳成功代碼
    } catch (error) {
        console.error('Error deleting job:', error);
        return 0; // 回傳失敗代碼而非拋出錯誤
    }
};

export const addJob = async (uid, job) => {
    try {
        // 檢查 job.name 是否為空字串
        if (!job.name || job.name.trim() === '') {
            return 'Job name cannot be empty';
        }

        const jobsRef = collection(db, 'users', uid, 'jobs');

        // 檢查是否有重複的技能名稱
        const q = query(jobsRef, where('name', '==', job.name));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            throw new Error(`Job "${job.name}" already exists`);
        }

        // 新增技能（自動生成文檔 ID）
        const newJobRef = doc(jobsRef);
        await setDoc(newJobRef, job);
        console.log(`Job "${job.name}" added successfully with ID: ${newJobRef.id}`);
        return { jobId: newJobRef.id }; // 返回新技能的 ID
    } catch (error) {
        console.error('Error adding job:', error);
        throw error;
    }
};

export const getAllJobs = async (uid) => {
    try {
        const jobsRef = collection(db, 'users', uid, 'jobs');
        const querySnapshot = await getDocs(jobsRef);

        if (querySnapshot.empty) {
            console.log('No Jobs found for this user.');
            return []; // 返回空數組
        }

        const Jobs = [];
        querySnapshot.forEach((doc) => {
            Jobs.push({ id: doc.id, ...doc.data() }); // 包含文檔 ID 和技能資料
        });

        return Jobs;
    } catch (error) {
        console.error('Error fetching all Jobs:', error);
        throw error;
    }
};

// 修改技能資料的函數
export const updateJob = async (uid, jobId, updatedJob) => {
    if (!uid || !jobId || !updatedJob || !updatedJob.name) {
        console.error('Invalid parameters: Missing uid, jobId, or updatedJob data');
        return 0; // 返回失敗代碼
    }

    try {
        const jobsRef = collection(db, 'users', uid, 'jobs');
        const q = query(
            jobsRef,
            where('name', '==', updatedJob.name), // 檢查技能名稱是否重複
            where('__name__', '!=', jobId) // Firestore 文檔 ID 是 `__name__`
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            console.warn(`Job with name "${updatedJob.name}" already exists.`);
            return `Job with name "${updatedJob.name}" already exists`; // 返回具體錯誤訊息
        }

        // 更新技能文檔
        const JobRef = doc(db, 'users', uid, 'jobs', jobId); // 獲取指定技能的文檔引用
        await updateDoc(JobRef, updatedJob); // 更新技能資料
        console.log(`Job with ID ${jobId} updated successfully`);
        return 1; // 成功代碼
    } catch (error) {
        console.error('Error updating job:', error);
        return 0;
    }
};

// ==============================|| skill API ||============================== //

export const getSkillDetails = async (uid, skillId) => {
    try {
        const skillDocRef = doc(db, 'users', uid, 'skills', skillId);
        const skillDoc = await getDoc(skillDocRef);

        if (skillDoc.exists()) {
            return skillDoc.data();
        } else {
            throw new Error('Skill not found');
        }
    } catch (error) {
        console.error('Error fetching skill details:', error);
        throw error;
    }
};

export const deleteSkill = async (uid, skillId) => {
    if (!uid || !skillId) {
        console.error('Invalid parameters: uid or skillId is missing');
        return 0; // 明確回傳失敗代碼
    }

    try {
        const skillDocRef = doc(db, 'users', uid, 'skills', skillId);
        await deleteDoc(skillDocRef);
        console.log(`Skill with ID ${skillId} deleted successfully`);
        return 1; // 明確回傳成功代碼
    } catch (error) {
        console.error('Error deleting skill:', error);
        return 0; // 回傳失敗代碼而非拋出錯誤
    }
};

export const addSkill = async (uid, skill) => {
    try {
        // 檢查 skill.name 是否為空字串
        if (!skill.name || skill.name.trim() === '') {
            return 'Skill name cannot be empty';
        }

        const skillsRef = collection(db, 'users', uid, 'skills');

        // 檢查是否有重複的技能名稱
        const q = query(skillsRef, where('name', '==', skill.name));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            throw new Error(`Skill "${skill.name}" already exists`);
        }

        // 新增技能（自動生成文檔 ID）
        const newSkillRef = doc(skillsRef);
        await setDoc(newSkillRef, skill);
        console.log(`Skill "${skill.name}" added successfully with ID: ${newSkillRef.id}`);
        return { skillId: newSkillRef.id }; // 返回新技能的 ID
    } catch (error) {
        console.error('Error adding skill:', error);
        throw error;
    }
};

export const getAllSkills = async (uid) => {
    try {
        const skillsRef = collection(db, 'users', uid, 'skills');
        const querySnapshot = await getDocs(skillsRef);

        if (querySnapshot.empty) {
            console.log('No skills found for this user.');
            return []; // 返回空數組
        }

        const skills = [];
        querySnapshot.forEach((doc) => {
            skills.push({ id: doc.id, ...doc.data() }); // 包含文檔 ID 和技能資料
        });

        return skills;
    } catch (error) {
        console.error('Error fetching all skills:', error);
        throw error;
    }
};

// 修改技能資料的函數
export const updateSkill = async (uid, skillId, updatedSkill) => {
    if (!uid || !skillId || !updatedSkill || !updatedSkill.name) {
        console.error('Invalid parameters: Missing uid, skillId, or updatedSkill data');
        return 0; // 返回失敗代碼
    }

    try {
        const skillsRef = collection(db, 'users', uid, 'skills');
        const q = query(
            skillsRef,
            where('name', '==', updatedSkill.name), // 檢查技能名稱是否重複
            where('__name__', '!=', skillId) // Firestore 文檔 ID 是 `__name__`
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            console.warn(`Skill with name "${updatedSkill.name}" already exists.`);
            return `Skill with name "${updatedSkill.name}" already exists`; // 返回具體錯誤訊息
        }

        // 更新技能文檔
        const skillRef = doc(db, 'users', uid, 'skills', skillId); // 獲取指定技能的文檔引用
        const LM_all = await getAllLMs(uid, skillId);
        updatedSkill.n_LM = LM_all.length;
        updatedSkill.n_finished = LM_all.filter((LM) => LM.status === 1).length;
        if (updatedSkill.n_LM === updatedSkill.n_finished) {
            updatedSkill.status = 1;
        } else {
            updatedSkill.status = 0;
        }
        await updateDoc(skillRef, updatedSkill); // 更新技能資料

        console.log(`Skill with ID ${skillId} updated successfully`);
        return 1; // 成功代碼
    } catch (error) {
        console.error('Error updating skill:', error);
        return 0;
    }
};

// ==============================|| LM API ||============================== //

export const getLMDetails = async (uid, skillId, LMId) => {
    try {
        const DocRef = doc(db, 'users', uid, 'skills', skillId, 'learning_materials', LMId);
        const Doc = await getDoc(DocRef);

        if (Doc.exists()) {
            return Doc.data();
        } else {
            throw new Error('Learning_material not found');
        }
    } catch (error) {
        console.error('Error fetching learning material details:', error);
        throw error;
    }
};

export const deleteLM = async (uid, skillId, LMId) => {
    if (!uid || !skillId || !LMId) {
        console.error('Invalid parameters: uid, skillId, or LMId is missing');
        return 0; // 明確回傳失敗代碼
    }

    try {
        const DocRef = doc(db, 'users', uid, 'skills', skillId, 'learning_materials', LMId);
        await deleteDoc(DocRef);
        const skill_detail = await getSkillDetails(uid, skillId);
        await updateSkill(uid, skillId, skill_detail);
        console.log(`Learning material with ID ${LMId} deleted successfully`);
        return 1; // 明確回傳成功代碼
    } catch (error) {
        console.error('Error deleting learning material:', error);
        return 0; // 回傳失敗代碼而非拋出錯誤
    }
};

export const addLM = async (uid, skillId, LM) => {
    try {
        // 定位到學習資源的子集合
        const LMCollectionRef = collection(
            db,
            'users',
            uid,
            'skills',
            skillId,
            'learning_materials' // 定義子集合
        );

        // 新增技能（自動生成文檔 ID）
        const newLMRef = doc(LMCollectionRef);
        await setDoc(newLMRef, LM);
        const skill_detail = await getSkillDetails(uid, skillId);
        await updateSkill(uid, skillId, skill_detail);
        console.log(`Learning material "${LM.name}" added successfully with ID: ${newLMRef.id}`);
        return { LMId: newLMRef.id }; // 返回新技能的 ID
    } catch (error) {
        console.error('Error adding learning material:', error);
        throw error;
    }
};

export const getAllLMs = async (uid, skillId) => {
    try {
        const LMCollectionRef = collection(
            db,
            'users',
            uid,
            'skills',
            skillId,
            'learning_materials' // 定義子集合
        );
        const querySnapshot = await getDocs(LMCollectionRef);

        if (querySnapshot.empty) {
            console.log('No learning materials found for this skill.');
            return []; // 返回空數組
        }

        const LMs = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));
        console.log(`${LMs.length} learning materials found for skill ID ${skillId}.`);
        return LMs;
    } catch (error) {
        console.error('Error fetching all learning materials:', error);
        return { status: 'error', error: error.message }; // 返回錯誤信息
    }
};

export const updateLM = async (uid, skillId, LMId, updatedItem) => {
    if (!uid || !skillId || !LMId || !updatedItem || !updatedItem.name) {
        console.error('Invalid parameters: Missing uid, skillId, or updated learning material data');
        return 0; // 返回失敗代碼
    }

    try {
        const Ref1 = collection(db, 'users', uid, 'skills', skillId, 'learning_materials');
        const q = query(
            Ref1,
            where('name', '==', updatedItem.name), // 檢查技能名稱是否重複
            where('__name__', '!=', LMId) // Firestore 文檔 ID 是 `__name__`
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            console.warn(`Learning material with name "${updatedItem.name}" already exists.`);
            return `Skill with name "${updatedItem.name}" already exists`; // 返回具體錯誤訊息
        }

        // 更新技能文檔
        const Ref2 = doc(db, 'users', uid, 'skills', skillId, 'learning_materials', LMId); // 獲取指定技能的文檔引用
        await updateDoc(Ref2, updatedItem); // 更新技能資料
        const skill_detail = await getSkillDetails(uid, skillId);
        await updateSkill(uid, skillId, skill_detail);
        console.log(`Learning material with ID ${LMId} updated successfully`);
        return 1; // 成功代碼
    } catch (error) {
        console.error('Error updating learning material:', error);
        return 0;
    }
};
