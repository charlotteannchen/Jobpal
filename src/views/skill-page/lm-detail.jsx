import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

// material-ui
import { Box, Typography, Button, Chip, TextField, Grid, Card } from "@mui/material";

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import { getAllLMs, getLMDetails, deleteLM, addLM, updateLM } from '../../contexts/FirestoreAPI';
import {extractYouTubeVideoId, YouTubeEmbed, WebEmbed } from './embed';

// ==============================|| SAMPLE PAGE ||============================== //

const LMDetail = () => {
    // 狀態來存儲技能數據
    const [error, setError] = useState(null);
    const [pageItem, setPageItem] = useState(null);
    const [modifiedItem, setModifiedItem] = useState(null);
    const [otherItemName, setOtherItemName] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false); // 新增状态控制编辑模式
    const [isAdding, setIsAdding] = useState(false); // 新增状态控制编辑模式
  
    const navigate = useNavigate();
    const userId = sessionStorage.getItem('userId');
    const skillId = sessionStorage.getItem('skillId');
    const LMId = sessionStorage.getItem('LMId');
  
    if (!userId || !skillId || !LMId) {
      console.error("uid, skillId, or LMId is null or undefined:", { userId, skillId, LMId });
      return;
    }
  
    // 檢查是否為新增模式
    useEffect(() => {
      const fetchData = async () => {
        let lm_detail = {};  // 在這裡定義 lm_detail，保證其在任何情況下都是有效的
        if (LMId.toString() === '-1') {
          setIsAdding(true); // If LMId is -1, enter add mode
          setIsEditing(true);
          lm_detail = {
            name: '',
            URL: '',
            duration: null,
            status: 1,
            note: '',
          }
        } else {
          setIsAdding(false);
          setIsEditing(false);  // Set editing mode if LMId is valid
          try {
            lm_detail = await getLMDetails(userId, skillId, LMId);
            console.log("Fetching learning material details success");
          } catch (err) {
            setError(err.message);  // Set error message
            console.error("Error fetching learning material details:", err);
          }
        }
        setPageItem(lm_detail);
        setModifiedItem(lm_detail);
      };

      const getOtherItemName = async () => {
        try {
          const allItem = await getAllLMs(userId, skillId);
          const itemsExcludingCurrent = allItem.filter(itm => itm.id !== LMId);
          const itemNames = itemsExcludingCurrent.map(itm => itm.name);
          setOtherItemName(itemNames)
        } catch (error) {
          console.error("Error fetching or processing items:", error);
          setOtherItemName([]); // Return an empty list if there's an error
        }
      };
  
      fetchData();  // Call the function to fetch learning material data
      getOtherItemName();
    }, [userId, skillId, LMId]);  // Re-run the effect when skillId, userId, or LMId changes

    useEffect(() => {
      if (pageItem && modifiedItem) {
        setLoading(false);
      }
    }, [pageItem, modifiedItem]); // pageItem is the dependency, so this runs after it updates
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
          // 等待 addSkill 完成並獲取返回的 LMId
          const result = await addLM(userId, skillId, modifiedItem);
          sessionStorage.setItem('LMId', result.LMId);
          console.log("Adding new learning material success");
        } else {
          await updateLM(userId, skillId, LMId, modifiedItem);
          console.log("Updateing learning material success");
        };
        setIsAdding(false); // 保存后退出编辑模式
        setIsEditing(false); // 保存后退出编辑模式
      } catch (error) {
        console.error("Error saving learning material:", error);
        setError("An error occurred while saving the learning material.");
      }
    };

    const handleDownload = (textToDownload, filename) => {
      const blob = new Blob([textToDownload], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
  
      const a = document.createElement('a');
      a.href = url;
      a.download = filename; // 文件名
      a.click();
      window.URL.revokeObjectURL(url); // 釋放資源
    };

    const checkItemName = (name) => {
      if (!name || name.trim() === '') {
        return "Learning material name is required"; // 如果是空或只有空格
      }
      const isDuplicate = otherItemName.some(n => n === name);
      if (isDuplicate) {
        return "Learning material name must be unique";
      }
      return ''; // 否則返回 true，表示有效
    }
  
    return (
      <MainCard>
        {!!pageItem?.URL && (
          /* YouTube 嵌入邏輯 */
          extractYouTubeVideoId(pageItem.URL) ? (
            <div>
              <YouTubeEmbed videoId={extractYouTubeVideoId(pageItem.URL)} />
            </div>
          ) : (
            <div>
              <WebEmbed url={pageItem.URL} />
            </div>
          )
        )}
        
        {isEditing ? (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                multiline
                //rows={1} 
                label="Learning Material Name"
                name="name"
                value={modifiedItem.name}
                onChange={handleChange}
                error={!!checkItemName(modifiedItem.name)}  // 當checkItemName(skill.name)不為空時，顯示錯誤
                helperText={checkItemName(modifiedItem.name)}  // 顯示錯誤訊息
              />
            </Grid>

            {/* URL */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                multiline
                //rows={1}
                label="URL"
                name="URL"
                value={modifiedItem.URL}
                onChange={handleChange}
              />
            </Grid>
            
            {/* Duration */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                multiline
                //rows={1}
                label="Duration (in mintues)"
                name="duration"
                value={modifiedItem.duration}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Learning Material Name:</Typography>
              <Typography variant="body1">{pageItem.name}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>                
              <Typography variant="subtitle1">URL:</Typography>
              <Typography variant="body1">{pageItem.URL}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>                
              <Typography variant="subtitle1">Duration:</Typography>
              <Typography variant="body1">
                {pageItem.duration ? `${pageItem.duration} minutes` : 'Unknown'}
              </Typography>
            </Grid>
          </Grid>
        )}
        {/* Status */}
        <Typography variant="subtitle1">Status:</Typography>
          <Button
            variant="contained"
            style={{ backgroundColor: pageItem.status === 0 ? "#ffccbc" : "#dcedc8" }}
            onClick={async () => {
              // 更新狀態並提交到後端
              const updatedPageItem = { ...pageItem, status: 1 - pageItem.status };
              await updateLM(userId, skillId, LMId, updatedPageItem);
              setPageItem(updatedPageItem); // 更新狀態
              setModifiedItem(updatedPageItem);
            }} 
          >
            {pageItem.status === 0 ? "In progress" : "Finished"}
          </Button>

      
          {/* Notes */}
          <Typography variant="subtitle1">Notes:</Typography>
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

            <Box sx={{ mt: 3, display: "flex",justifyContent: 'flex-end' }}>
              {/* Download按钮 */}
              <Button variant="contained" color="primary" onClick={
                () => handleDownload(modifiedItem.note, modifiedItem.name +'_note.txt')}>
                Download
              </Button>
              {/* save按钮 */}
              <Button variant="contained" color="primary" onClick={handleSave}>
                {isEditing ? "Save all" : "Save notes"}
              </Button>
            </Box>

            {/* Back按钮 */}
            <Button
              variant="contained"
              color="primary"
              onClick={async () => {
                navigate("/skill-detail")
              }} // 点击按钮切换编辑状态
            >Back</Button>
  
            {/* cancel/edit按钮 */}
            <Button
              variant={isEditing ? "outlined" : "contained"}
              color={isEditing ? "secondary" : "primary"}
              onClick={async () => {
                if (isEditing && LMId.toString() === '-1') {
                  navigate("/skill-detail")
                }
                setIsEditing(!isEditing); // 点击按钮切换编辑状态
                const pageItem_detail = await getLMDetails(userId, skillId, LMId);
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
                const result = await deleteLM(userId, skillId, LMId);
                if (result === 1) {
                  console.log('Learning material deletion successful');
                  navigate("/skill-detail");
                } else {
                  console.error('Failed to delete the learning material');
                  // 處理失敗情況，例如顯示提示訊息
                }
              }} // 点击按钮切换编辑状态
            >Delete</Button>
      </MainCard>
    );
  }
  
  export default LMDetail;
