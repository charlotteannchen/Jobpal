import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

// material-ui
import { Box, Typography, Button, Chip, TextField, Grid, Card } from "@mui/material";

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import { getAllSkills, getSkillDetails, deleteSkill, addSkill, updateSkill, getAllLMs, getJobDetails } from '../../contexts/FirestoreAPI';

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
  const [pageItem, setPageItem] = useState(null);
  const [modifiedItem, setModifiedItem] = useState(null);
  const [otherItemName, setOtherItemName] = useState([]);
  const [error, setError] = useState(null);
  const [LMs, setLM] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // 新增状态控制编辑模式
  const [isAdding, setIsAdding] = useState(false); // 新增状态控制编辑模式

  const navigate = useNavigate();
  const userId = sessionStorage.getItem('userId');;
  const skillId = sessionStorage.getItem('skillId');

  if (!userId || !skillId) {
    console.error("uid or skillId is null or undefined:", { userId, skillId });
    return;
  }
  
  // 檢查是否為新增模式
  useEffect(() => {
    const fetchSkillData = async () => {
      let skill_detail = {};
      if (skillId.toString() === '-1') {
        setIsAdding(true); // If skillId is -1, enter add mode
        setIsEditing(true);
        skill_detail = {
          name: '',
          description: '',
          related_job: [],
          n_LM: 0,
          n_finished: 0,
          status: 1,
          note: '',
        };
      } else {
        setIsAdding(false);
        setIsEditing(false);  // Set editing mode if skillId is valid
        try {
          skill_detail = await getSkillDetails(userId, skillId);
          console.log("Fetching skill details success");
          const LM_all = await getAllLMs(userId, skillId);
          setLM(LM_all)
        } catch (err) {
          setError(err.message);  // Set error message
          console.error("Error fetching skill details:", err);
        }
      }
      setPageItem(skill_detail);
      setModifiedItem(skill_detail);
    };

    const getOtherItemName = async () => {
      try {
        const allItems = await getAllSkills(userId);
        const itemsExcludingCurrent = allItems.filter(skill => skill.id !== skillId);
        const itemNames = itemsExcludingCurrent.map(skill => skill.name);
        setOtherItemName(itemNames)
      } catch (error) {
        console.error("Error fetching or processing skills:", error);
        setOtherItemName([]); // Return an empty list if there's an error
      }
    };

    fetchSkillData();  // Call the function to fetch skill data
    getOtherItemName();
  }, [skillId, userId]);  // Re-run the effect when skillId or userId changes

  useEffect(() => {
    if (pageItem && modifiedItem) {
      setLoading(false);
    }
  }, [pageItem, modifiedItem]);
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
    // 檢查 skill.name
    if (!!checkItemName(modifiedItem.name)) {
      console.error("Name invalid");
      return;
    }
    setPageItem(modifiedItem);
    try {
      if (isAdding) {
        // 等待 addSkill 完成並獲取返回的 skillId
        const result = await addSkill(userId, modifiedItem);
        sessionStorage.setItem('skillId', result.skillId);
        console.log("Adding new skill success");
      } else {
        await updateSkill(userId, skillId, modifiedItem);
        console.log("Updateing skill success");
      };
      setIsAdding(false); // 保存后退出编辑模式
      setIsEditing(false); // 保存后退出编辑模式
    } catch (error) {
      console.error("Error saving skill:", error);
      setError("An error occurred while saving the skill.");
    }
  };

  const checkItemName = (name) => {
    if (!name || name.trim() === '') {
      return "Skill name is required"; // 如果是空或只有空格
    }
    const isDuplicate = otherItemName.some(n => n === name);
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

            {/* Skill Description */}
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
    
            {/* Related Jobs */}
            <Typography component="dt" variant="body1" sx={{ textAlign: "right" }}>
              Related Jobs:
            </Typography>
            <Typography component="dd" variant="body1">
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, marginTop: 1 }}>
                  {pageItem.related_job.map((job, index) => (
                    <Chip key={index} label={job.name} color="primary"
                      onClick={() => {
                          sessionStorage.getItem('jobId', job.id);
                          navigate('/job-detail')
                        }
                      }/>
                  ))}
                </Box>
            </Typography>
    
            {/* Skill Status */}
            <Typography component="dt" variant="body1" sx={{ textAlign: "right" }}>
              Status:
            </Typography>
            <Typography component="dd" variant="body1">
              <Chip
                label={pageItem.status === 0 ? "In progress" : "Finished"}
                sx={{
                  backgroundColor: pageItem.status === 0 ? "#ffccbc" : "#dcedc8",
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
              navigate("/skill-page")
            }} // 点击按钮切换编辑状态
          >Back</Button>

          {/* cancel/edit按钮 */}
          <Button
            variant={isEditing ? "outlined" : "contained"}
            color={isEditing ? "secondary" : "primary"}
            onClick={async () => {
              if (isEditing && skillId.toString() === '-1') {
                navigate("/skill-page")
              }
              setIsEditing(!isEditing); // 点击按钮切换编辑状态
              const pageItem_detail = await getSkillDetails(userId, skillId);
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