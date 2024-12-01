import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

// material-ui
import { Box, Typography, Button, Chip, TextField, Grid, Card } from "@mui/material";

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import { getAllJobs, getJobDetails, deleteJob, addJob, updateJob, getAllSkills, updateSkill, getSkillDetails } from '../../contexts/FirestoreAPI';

// ==============================|| SkillBox ||============================== //
const SkillBox = ({ skillId, label, handleDelete }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    // 保存 SkillId
    sessionStorage.setItem('skillId', skillId);
    navigate("/skill-detail")
  };

  return (
    <Card sx={{ mb: 3, boxShadow: 1, width: '100%', position: 'relative' }}>
      <Box
        onClick={handleClick} // 在点击时调用保存逻辑
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4,
          bgcolor: 'primary.light',
          color: 'grey.800',
          cursor: 'pointer', // 讓游標變為手形，表示這是一個可點擊區域
          textDecoration: 'none' // 取消超連結底線
        }}
      >
        {!label && <Box sx={{ color: 'inherit' }}>boxShadow: {shadow}</Box>}
        {label && <Box sx={{ color: 'inherit' }}>{label}</Box>}
      </Box>

      {/* 刪除按鈕 */}
      <Button
        variant="contained"
        sx={{ backgroundColor: 'red', color: 'white',
          position: 'absolute', // 絕對定位
          bottom: 0,            // 固定在父容器底部
          right: 0,             // 固定在父容器右側
          width: '10%',         // 占據父容器的1/4寬度
          height: '100%',       // 固定高度，可以根據需要調整
        }}
        onClick={handleDelete} // 点击按钮切换编辑状态
      >Delete</Button>
    </Card>
  );
};

SkillBox.propTypes = {
  label: PropTypes.string.isRequired
};

// ==============================|| SAMPLE PAGE ||============================== //

const JobDetail = () => {
  // 狀態來存儲技能數據
  const [pageItem, setPageItem] = useState(null);
  const [modifiedItem, setModifiedItem] = useState(null);
  const [otherItemName, setOtherItemName] = useState([]);
  const [error, setError] = useState(null);
  const [Skills, setSkill] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // 新增状态控制编辑模式
  const [isAdding, setIsAdding] = useState(false); // 新增状态控制编辑模式
  const [selectedOption, setSelectedOption] = useState('');

  const navigate = useNavigate();
  const userId = sessionStorage.getItem('userId');
  const jobId = sessionStorage.getItem('jobId');

  if (!userId || !jobId) {
    console.error("uid or jobId is null or undefined:", { userId, jobId });
    return;
  }
  
  // 檢查是否為新增模式
  useEffect(() => {
    const fetchJobData = async () => {
      let job_detail = {};
      if (jobId.toString() === '-1') {
        setIsAdding(true); // If jobId is -1, enter add mode
        setIsEditing(true);
        job_detail = {
          name: '',
          company: '',
          description: '',
          references: '',
          related_skill: [],
          events: '',
          status: '0',
          note: '',
        };
      } else {
        setIsAdding(false);
        setIsEditing(false);  // Set editing mode if jobId is valid
        try {
          job_detail = await getJobDetails(userId, jobId);
          console.log("Fetching job details success");
          const Skill_all = await getAllSkills(userId, jobId);
          setSkill(Skill_all)
        } catch (err) {
          setError(err.message);  // Set error message
          console.error("Error fetching job details:", err);
        }
      }
      setPageItem(job_detail);
      setModifiedItem(job_detail);
    };

    const getOtherItemName = async () => {
      try {
        const allItems = await getAllJobs(userId);
        const itemsExcludingCurrent = allItems.filter(job => job.id !== jobId);
        const itemNames = itemsExcludingCurrent.map(job => job.name);
        setOtherItemName(itemNames)
      } catch (error) {
        console.error("Error fetching or processing jobs:", error);
        setOtherItemName([]); // Return an empty list if there's an error
      }
    };

    fetchJobData();  // Call the function to fetch job data
    getOtherItemName();
  }, [jobId, userId]);  // Re-run the effect when jobId or userId changes

  // 當選擇的選項改變時觸發的效果
  useEffect(() => {
    const updateSkillInfo = async () => {
      if (selectedOption) {
        if (selectedOption === '-1') {
          sessionStorage.setItem('skillId', '-1');
          navigate("/skill-detail")
        } else {
          console.log(`You selected: ${selectedOption}`);
          const updatedRelatedSkills = [...pageItem.related_skill, selectedOption];
          const updatedPageItem = { ...pageItem, related_skill: updatedRelatedSkills }; // 更新 pageItem
          const skillToUpdate = await getSkillDetails(userId, selectedOption);
          skillToUpdate.related_job.push({id: jobId, name: pageItem.name});
          updateJob(userId, jobId, updatedPageItem);
          updateSkill(userId, selectedOption, skillToUpdate);
          setPageItem(updatedPageItem);
        }
      };
    };
    updateSkillInfo(); // 調用異步函數
  }, [selectedOption]); // 依賴 selectedOption

  const DeleteARelatedSkill = async (userId, jobId, skillId) => {
    console.log("Delete related skill button slicked.")
    const updatedList = pageItem.related_skill.filter(item => item !== skillId);
    const updatedPageItem = { ...pageItem, related_skill: updatedList };
    const skillToUpdate = await getSkillDetails(userId, skillId);
    console.log(skillToUpdate.related_job);
    skillToUpdate.related_job = skillToUpdate.related_job.filter(item => item.id !== jobId);
    console.log(jobId);
    console.log(skillToUpdate.related_job.filter(item => item.id !== jobId));
    updateJob(userId, jobId, updatedPageItem);
    updateSkill(userId, skillId, skillToUpdate);
    setPageItem(updatedPageItem);
  };

  useEffect(() => {
    if (pageItem && modifiedItem && Skills) {
      setLoading(false);
    }
  }, [pageItem, modifiedItem, Skills]);
  // 提前return加載狀態，避免未加載完成時渲染資料
  if (loading) {
    return <Typography variant="body1">Loading...</Typography>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setModifiedItem({
      ...modifiedItem,
      [name]: value,
    });
  };

  // 编辑模式下的保存操作
  const handleSave = async () => {
    console.log("Save button clicked!"); // 測試按鈕點擊
    // 檢查 job.name
    if (!!checkItemName(modifiedItem.name)) {
      console.error("Name invalid");
      return;
    }
    setPageItem(modifiedItem);
    try {
      if (isAdding) {
        // 等待 addJob 完成並獲取返回的 jobId
        const result = await addJob(userId, modifiedItem);
        sessionStorage.setItem('jobId', result.jobId);
        console.log("Adding new job success");
      } else {
        await updateJob(userId, jobId, modifiedItem);
        console.log("Updateing job success");
      };
      setIsAdding(false); // 保存后退出编辑模式
      setIsEditing(false); // 保存后退出编辑模式
    } catch (error) {
      console.error("Error saving job:", error);
      setError("An error occurred while saving the job.");
    }
  };

  const checkItemName = (name) => {
    if (!name || name.trim() === '') {
      return "Job name is required"; // 如果是空或只有空格
    }
    const isDuplicate = otherItemName.some(n => n === name);
    if (isDuplicate) {
      return "Job name must be unique";
    }

    return ''; // 否則返回 true，表示有效
  }

  return (
    <MainCard title="Job">
      <Grid container spacing={3}>
        {/* 左側列 */}
        <Grid item xs={12} sm={6}>
          {/* 信息列表 */}
          <Box
            component="dl"
            sx={{
              display: "grid",
              gridTemplateColumns: "auto 1fr", // 左右兩列
              columnGap: 2,                   // 列間距
              rowGap: 1,                      // 行間距
              alignItems: "center",           // 垂直居中
            }}
          >
            {/* Job Name */}
            <Typography component="dt" variant="body1" sx={{ textAlign: "right" }}>
              Name:
            </Typography>
            <Typography component="dd" variant="body1">
            {isEditing ? (
                <TextField
                  fullWidth
                  multiline
                  name="name"
                  value={modifiedItem.name}
                  onChange={handleChange}
                  error={!!checkItemName(modifiedItem.name)}  // 當checkItemName(pageItem.name)不為空時，顯示錯誤
                  helperText={checkItemName(modifiedItem.name)}  // 顯示錯誤訊息
                />
              ) : (
                pageItem.name
              )}
            </Typography>

            {/* Company */}
            <Typography component="dt" variant="body1" sx={{ textAlign: "right" }}>
              Company:
            </Typography>
            <Typography component="dd" variant="body1">
              {isEditing ? (
                <TextField
                  fullWidth
                  multiline
                  name="company"
                  value={modifiedItem.company}
                  onChange={handleChange}
                />
              ) : (
                pageItem.company
              )}
            </Typography>

            {/* Job Description */}
            <Typography component="dt" variant="body1" sx={{ textAlign: "right" }}>
              Description:
            </Typography>
            <Typography component="dd" variant="body1">
            {isEditing ? (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  name="description"
                  value={modifiedItem.description}
                  onChange={handleChange}
                />
              ) : (
                pageItem.description
              )}
            </Typography>

            {/* References */}
            <Typography component="dt" variant="body1" sx={{ textAlign: "right" }}>
              References:
            </Typography>
            <Typography component="dd" variant="body1">
              {isEditing ? (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  name="references"
                  value={modifiedItem.references}
                  onChange={handleChange}
                />
              ) : (
                pageItem.references
              )}
            </Typography>

            {/* Events */}
            <Typography component="dt" variant="body1" sx={{ textAlign: "right" }}>
              Events:
            </Typography>
            <Typography component="dd" variant="body1">
              {isEditing ? (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  name="events"
                  value={modifiedItem.events}
                  onChange={handleChange}
                />
              ) : (
                pageItem.events
              )}
            </Typography>
    
            {/* Job Status */}
            <Typography component="dt" variant="body1" sx={{ textAlign: "right" }}>
              Status:
            </Typography>
            
            <div>
            {isEditing ? (
                <select
                id="dropdown"
                name="status"
                value={modifiedItem.status}
                onChange={handleChange}
              >
                {['Listed', 'Learning', 'Applied', 'Interviewing', 'Finish'].map((sta, index) => (
                  <option key={index} value={index}>
                    {sta}
                  </option>
                ))}
              </select>
              ) : (
                ['Listed', 'Learning', 'Applied', 'Interviewing', 'Finish'][pageItem.status]
              )}
              </div>
            
    
            {/* Notes */}
            <Typography component="dt" variant="body1" sx={{ textAlign: "right", alignSelf: "flex-start" }}>
              Notes:
            </Typography>
            <Typography component="dd" variant="body1">
              <TextField
                fullWidth
                multiline
                rows={6}
                name="note"
                value={modifiedItem.note}
                onChange={handleChange}
              />
            </Typography>
          </Box>

          {/* save按钮 */}
          <Box sx={{ mt: 3, display: "flex",justifyContent: 'flex-end' }}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              {isEditing ? "Save all" : "Save notes"}
            </Button>
          </Box>

          {/* Back按钮 */}
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              navigate("/job-page")
            }} // 点击按钮切换编辑状态
          >Back</Button>

          {/* cancel/edit按钮 */}
          <Button
            variant={isEditing ? "outlined" : "contained"}
            color={isEditing ? "secondary" : "primary"}
            onClick={async () => {
              if (isEditing && jobId.toString() === '-1') {
                navigate("/job-page")
              }
              setIsEditing(!isEditing); // 点击按钮切换编辑状态
              const pageItem_detail = await getJobDetails(userId, jobId);
              setPageItem(pageItem_detail);
            }}
          >
            {isEditing ? "Cancel" : "Edit"}
          </Button>

          {/* delete按钮 */}
          <Button
            variant="contained"
            sx={{ backgroundColor: 'red', color: 'white' }}
            onClick={async () => {
              const result = await deleteJob(userId, jobId);
              if (result === 1) {
                console.log('Job deletion successful');
                navigate("../job-page");
              } else {
                console.error('Failed to delete the job');
                // 處理失敗情況，例如顯示提示訊息
              }
            }} // 点击按钮切换编辑状态
          >Delete</Button>
        </Grid>

        {/* 右側列 */}
        <Grid item xs={12} sm={6}>
          <Grid item>
            <Typography variant="h3">Required Skills</Typography>
          </Grid>
          {!isAdding && (
          <div>
            <label htmlFor="dropdown">Add other required skills:</label>
            <select
              id="dropdown"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="">select a skill</option>
              {Skills.filter(Skill => !pageItem.related_skill.includes(Skill.id)).map(Skill => (
                <option key={Skill.id} value={Skill.id}>
                  {Skill.name}
                </option>
              ))}
              <option key="add other skill" value={-1}>
                {"..Add other skill.."}
              </option>
            </select>
          </div>)}
          <SubCard title="In progress">
            <Grid container spacing={2}>
              {Skills.filter(Skill => Skill.status === 0 && pageItem.related_skill.includes(Skill.id)).map(Skill => (
                <SkillBox key={Skill.id} skillId={Skill.id} label={Skill.name}
                  handleDelete={() => DeleteARelatedSkill(userId, jobId, Skill.id)} 
                  />
              ))}
            </Grid>
          </SubCard>
          <SubCard title="Finished">
            <Grid container spacing={2}>
              {Skills.filter(Skill => Skill.status === 1 && pageItem.related_skill.includes(Skill.id)).map(Skill => (
                <SkillBox key={Skill.id} skillId={Skill.id} label={Skill.name}
                  handleDelete={() => DeleteARelatedSkill(userId, jobId, Skill.id)} 
                />
              ))}
            </Grid>
          </SubCard>
        </Grid>
      </Grid>
    </MainCard>
  );
}

export default JobDetail;
