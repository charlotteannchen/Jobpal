import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Button, Chip, TextField, Card, Grid } from "@mui/material";

// project imports
// import config from 'config';
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';

import {getAllSkills} from'../../contexts/FirestoreAPI';

// ===============================|| Skill BOX ||=============================== //

const SkillBox = ({ skillId, label, ...props  }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // 保存 skillId 到 Redux
    sessionStorage.setItem('skillId', skillId);
    navigate("/skill-detail")
  };

  return (
    <Card sx={{ mb: 3, boxShadow: 1 }} {...props}>
      <Box
        onClick={handleClick} // 在点击时调用保存逻辑
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 6,
          bgcolor: 'primary.light',
          color: 'grey.800',
          cursor: 'pointer', // 讓游標變為手形，表示這是一個可點擊區域
          textDecoration: 'none' // 取消超連結底線
        }}
      >
        {label && <Box sx={{ color: 'inherit' }}>{label}</Box>}
      </Box>
    </Card>
  );
};

SkillBox.propTypes = {
  label: PropTypes.string.isRequired,
  skillId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

// ============================|| UTILITIES SHADOW ||============================ //

const SkillPage = () => {
  const theme = useTheme();
  
  const userId = sessionStorage.getItem('userId');

  // 狀態來存儲技能數據
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // 讓組件在第一次渲染時執行 fetchSkill()
  // 空的依賴數組[]表示該副作用只在組件第一次掛載時執行一次。
  useEffect(() => {
    const fetchUserSkills = async () => {
      setLoading(true); // 開始加載
      setError(null); // 清除之前的錯誤
      try {
        // 獲取技能列表
        const results = await getAllSkills(userId);
        setSkills(results); // 設置技能列表
      } catch (err) {
        setError(`An error occurred: ${err.message || 'Unknown error'}`);
        console.error(`Error fetching skills:`, err);
      } finally {
        setLoading(false); // 無論成功還是失敗，結束加載
      }
    };

    fetchUserSkills();
  }, [userId]); // 添加依賴變數
  
  if (loading) {
    return <Typography variant="body1">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="body1" color="error">{error}</Typography>;
  }  

  return (
    <MainCard title="Skill">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SubCard title="In progress">
            <Grid container spacing={2}>
              {skills.filter(skill => skill.status === 0).map(skill => (
                <Grid key={skill.id} item xs={12} sm={6} md={4} lg={3}>
                  <SkillBox skillId={skill.id} label={skill.name} />
                </Grid>
              ))}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <SkillBox skillId={-1} label='+'  data-testid="inprogress-skill" />
              </Grid>
            </Grid>
          </SubCard>
        </Grid>
        <Grid item xs={12}>
          <SubCard title="Finished">
            <Grid container spacing={2}>
              {skills.filter(skill => skill.status === 1).map(skill => (
                <Grid key={skill.id} item xs={12} sm={6} md={4} lg={3}>
                  <SkillBox skillId={skill.id} label={skill.name} />
                </Grid>
              ))}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <SkillBox skillId={-1} label='+'  data-testid="finished-skill" />
              </Grid>
            </Grid>
          </SubCard>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default SkillPage;
