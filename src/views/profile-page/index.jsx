import { Button, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { useFirebase } from 'contexts/FirebaseContext';
import { useEffect, useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import MainCard from 'ui-component/cards/MainCard';

const ProfilePage = () => {
  const { userData, updateUserData } = useFirebase();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (userData) {
      setFormData({ ...userData });
    }
  }, [userData]);

  if (!userData) {
    return <Typography>Loading...</Typography>;
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUserData(formData);
    setIsEditing(false);
  };

  const formatDate = (timestamp) => {
    return timestamp instanceof Timestamp ? timestamp.toDate().toLocaleString() : '';
  };

  return (
    <MainCard title="Profile Information">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Birthday"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Jobs Seeking"
                    name="jobsSeeking"
                    value={formData.jobsSeeking}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                    Save
                  </Button>
                  <Button onClick={handleEditToggle} variant="outlined" color="secondary" sx={{ ml: 2 }}>
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </form>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">First Name:</Typography>
                <Typography variant="body1">{userData.firstName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Last Name:</Typography>
                <Typography variant="body1">{userData.lastName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Email:</Typography>
                <Typography variant="body1">{userData.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Phone:</Typography>
                <Typography variant="body1">{userData.phone}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Gender:</Typography>
                <Typography variant="body1">{userData.gender}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Birthday:</Typography>
                <Typography variant="body1">{userData.birthday}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Occupation:</Typography>
                <Typography variant="body1">{userData.occupation}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Jobs Seeking:</Typography>
                <Typography variant="body1">{userData.jobsSeeking}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Skills:</Typography>
                <Typography variant="body1">{userData.skills}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Created At:</Typography>
                <Typography variant="body1">{formatDate(userData.createdAt)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Last Login:</Typography>
                <Typography variant="body1">{formatDate(userData.lastLogin)}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Button onClick={handleEditToggle} variant="contained" color="primary">
                  Edit Profile
                </Button>
              </Grid>
            </Grid>
          )}
        </MainCard>
  );
};

export default ProfilePage;
