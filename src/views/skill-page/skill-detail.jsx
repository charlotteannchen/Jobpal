import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

// material-ui
import { Box, Typography, Button, Chip, TextField, Grid, Card } from "@mui/material";

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import { getAllSkills, getSkillDetails, deleteSkill, addSkill, updateSkill, getAllLMs } from '../../contexts/FirestoreAPI';

// ==============================|| LMBox ||============================== //
const LMBox = ({ LMId, label }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // 保存 LMId
    sessionStorage.setItem('LMId', LMId);
    navigate("/learning-material")
  };

  return (
    <Card sx={{ mb: 3, boxShadow: 1, width: '100%' }}>
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
    </Card>
  );
};

LMBox.propTypes = {
  label: PropTypes.string.isRequired
};

// ==============================|| SAMPLE PAGE ||============================== //

const SkillDetail = () => {
  // 狀態來存儲技能數據
  const [skill, setSkill] = useState(null);
  const [otherSkillName, setOtherSkillName] = useState([]);
  const [error, setError] = useState(null);
  const [LMs, setLM] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // 新增状态控制编辑模式
  const [isAdding, setIsAdding] = useState(false); // 新增状态控制编辑模式

  const navigate = useNavigate();
  const userId = 'BEOLCzjnxLRI9OxdNWf5oQjOBC63';
  const skillId = sessionStorage.getItem('skillId');

  if (!userId || !skillId) {
    console.error("uid or skillId is null or undefined:", { userId, skillId });
    return;
  }
  
  // 檢查是否為新增模式
  useEffect(() => {
    const fetchSkillData = async () => {
      if (skillId === '-1') {
        setIsAdding(true); // If skillId is -1, enter add mode
        setIsEditing(true);
        setSkill({
          name: '',
          description: '',
          related_job: [],
          n_LM: 0,
          n_finished: 0,
          status: 1,
          note: '',
        });
        setLoading(false);
      } else {
        setIsAdding(false);
        setIsEditing(false);  // Set editing mode if skillId is valid
        try {
          const skill_detail = await getSkillDetails(userId, skillId);
          setSkill(skill_detail);  // Set the fetched skill data
          const LM_all = await getAllLMs(userId, skillId);
          setLM(LM_all)
        } catch (err) {
          setError(err.message);  // Set error message
          console.error("Error fetching skill details:", err);
        } finally {
          setLoading(false);  // Update loading state
        }
      }
    };

    const getOtherSkillName = async (userId, skillId) => {
      try {
        // Fetch all skills
        const allSkills = await getAllSkills(userId);
    
        // Filter out the current skill by ID
        const skillsExcludingCurrent = allSkills.filter(skill => skill.id !== skillId);
    
        // Create a list of skill names from the filtered skills
        const skillNames = skillsExcludingCurrent.map(skill => skill.name);
        setOtherSkillName(skillNames)
      } catch (error) {
        console.error("Error fetching or processing skills:", error);
        setOtherSkillName([]); // Return an empty list if there's an error
      }
    };

    fetchSkillData();  // Call the function to fetch skill data
    getOtherSkillName(userId, skillId);
  }, [skillId, userId]);  // Re-run the effect when skillId or userId changes

  // 提前return加載狀態，避免未加載完成時渲染資料
  if (loading || !skill) {
    return <Typography variant="body1">Loading...</Typography>;
  }

  // 编辑模式下的保存操作
  const handleSave = async () => {
    console.log("Save button clicked!"); // 測試按鈕點擊

    // 檢查 skill.name
    if (checkSkillName(skill.name)) {
      return;
    }

    try {
      if (isAdding) {
        // 等待 addSkill 完成並獲取返回的 skillId
        const result = await addSkill(userId, skill);
        sessionStorage.setItem('skillId', result.skillId);
        setIsAdding(false); // 保存后退出编辑模式
        setIsEditing(false); // 保存后退出编辑模式
      } else {
        const result = await updateSkill(userId, skillId, skill);

        if (result === 1) {
          console.log('Skill updated successfully.');
          // 繼續處理其他成功邏輯
        } else if (typeof result === 'string') {
          console.warn(result); // 處理名稱重複等特殊情況
        } else {
          console.error('Failed to update the skill.');
          // 處理失敗邏輯，例如提示錯誤訊息
        }
        setIsEditing(false); // 保存后退出编辑模式
      };
      
    } catch (error) {
      console.error("Error saving skill:", error);
      setError("An error occurred while saving the skill.");
    }
  };

  const checkSkillName = (name) => {
    if (!name || name.trim() === '') {
      return "Skill name is required"; // 如果是空或只有空格
    }
    const isDuplicate = otherSkillName.some(n => n === name);
    if (isDuplicate) {
      return "Skill name must be unique";
    }

    return ''; // 否則返回 true，表示有效
  }

  return (
    <MainCard title="Skill">
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
            {/* Skill Name */}
            <Typography component="dt" variant="body1" sx={{ textAlign: "right" }}>
              Name:
            </Typography>
            <Typography component="dd" variant="body1">
            {isEditing ? (
                <TextField
                  value={skill.name}
                  onChange={(e) => setSkill({ ...skill, name: e.target.value })}
                  fullWidth
                  multiline
                  rows={1}
                  error={checkSkillName(skill.name)}  // 當checkSkillName(skill.name)不為空時，顯示錯誤
                  helperText={checkSkillName(skill.name)}  // 顯示錯誤訊息
                />
              ) : (
                skill.name
              )}
            </Typography>

            {/* Skill Description */}
            <Typography component="dt" variant="body1" sx={{ textAlign: "right" }}>
              Description:
            </Typography>
            <Typography component="dd" variant="body1">
            {isEditing ? (
                <TextField
                  value={skill.description}
                  onChange={(e) => setSkill({ ...skill, description: e.target.value })}
                  fullWidth
                  multiline
                  rows={4}
                />
              ) : (
                skill.description
              )}
            </Typography>
    
            {/* Related Jobs */}
            <Typography component="dt" variant="body1" sx={{ textAlign: "right" }}>
              Related Jobs:
            </Typography>
            <Typography component="dd" variant="body1">
              {isEditing ? (
                <TextField
                  value={skill.related_job.join(", ")}
                  onChange={(e) =>
                    setSkill({ ...skill, related_job: e.target.value.split(", ") })
                  }
                  fullWidth
                />
              ) : (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, marginTop: 1 }}>
                  {skill.related_job.map((job, index) => (
                    <Chip key={index} label={job} color="primary" />
                  ))}
                </Box>
              )}
            </Typography>
    
            {/* Skill Status */}
            <Typography component="dt" variant="body1" sx={{ textAlign: "right" }}>
              Status:
            </Typography>
            <Typography component="dd" variant="body1">
              <Chip
                label={skill.status === 0 ? "In progress" : "Finished"}
                sx={{
                  backgroundColor: skill.status === 0 ? "#ffccbc" : "#dcedc8",
                  color: "#000",
                  marginTop: 1,
                }}
              />
            </Typography>
    
            {/* Notes */}
            <Typography component="dt" variant="body1" sx={{ textAlign: "right", alignSelf: "flex-start" }}>
              Notes:
            </Typography>
            <Typography component="dd" variant="body1">
              {isEditing ? (
                <TextField
                  value={skill.note}
                  onChange={(e) => setSkill({ ...skill, note: e.target.value })}
                  fullWidth
                  multiline
                  rows={4}
                />
              ) : (
                skill.note
              )}
            </Typography>
          </Box>

          {/* save按钮 - 仅在编辑模式下显示 */}
          {isEditing && (
            <Box sx={{ mt: 3, display: "flex",justifyContent: 'flex-end' }}>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
            </Box>
          )}

          {/* Back按钮 */}
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              navigate("/skill-page")
            }} // 点击按钮切换编辑状态
          >Back</Button>

          {/* 保存/edit按钮 */}
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              if (isEditing && skillId === '-1') {
                navigate("/skill-page")
              }
              setIsEditing(!isEditing); // 点击按钮切换编辑状态
              const skill_detail = await getSkillDetails(userId, skillId);
              setSkill(skill_detail);
            }} 
          >
            {isEditing ? "Cancel" : "Edit"}
          </Button>

          {/* delete按钮 */}
          <Button
            variant="contained"
            sx={{ backgroundColor: 'red', color: 'white' }}
            onClick={async () => {
              const result = await deleteSkill(userId, skillId);
              if (result === 1) {
                console.log('Skill deletion successful');
                navigate("../skill-page");
              } else {
                console.error('Failed to delete the skill');
                // 處理失敗情況，例如顯示提示訊息
              }
            }} // 点击按钮切换编辑状态
          >Delete</Button>
        </Grid>

        {/* 右側列 */}
        <Grid item xs={12} sm={6}>
          <SubCard title="In progress">
            <Grid container spacing={2}>
              {LMs.filter(LM => LM.status === 0).map(LM => (
                <LMBox key={LM.id} LMId={LM.id} label={LM.name} />
              ))}
              {!isEditing && <LMBox key="add-new" LMId={-1} label="+" />}
            </Grid>
          </SubCard>
          <SubCard title="Finished">
            <Grid container spacing={2}>
              {LMs.filter(LM => LM.status === 1).map(LM => (
                <LMBox LMId={LM.id} label={LM.name} />
              ))}
            </Grid>
          </SubCard>
        </Grid>
      </Grid>
    </MainCard>
  );
}

export default SkillDetail;