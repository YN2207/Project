import React, { useState, useEffect } from "react";
import axios from "axios";
import { navigate } from "@reach/router";
import { Button, Typography, Grid, Paper, Card, CardMedia} from "@material-ui/core";
import GoalCard from "./GoalCard";
import Link from "@mui/material/Link";




const AllGoals = (props) => {
  const [allGoals, setAllGoals] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/goals")
      .then((allReturnedGoals) => {
        console.log(allReturnedGoals.data);
        setAllGoals(allReturnedGoals.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, []);

  const deleteGoalHandler = (goalId) => {
    axios
      .delete("http://localhost:8000/api/goals/" + goalId, {
        withCredentials: true,
      })
      .then((res) => {
        const deletedGoal = res.data;
        console.log(deletedGoal);
        const filteredGoalsArray = allGoals.filter(
          (goal) => goal._id !== goalId
        );
        setAllGoals(filteredGoalsArray);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Typography variant='h5' color='textPrimary'>
        All Goals
      </Typography>
      <div className='center'>
        {userId ? (
          <Button
            variant='contained'
            color='primary'
            onClick={() => navigate("/goals/new")}
          >
            Create New Goal
          </Button>
        ) : null}
      </div>
      {allGoals.map((goal, index) => (
        <div key={index}>
          <hr />
          <Grid container>
            <Grid item xs={5}>
              {console.log("Goal URL :" , goal.linkUrl)}
              
              <a href={goal.linkUrl} target="_blank" rel="noopener noreferrer">
              <img src={goal.pictureUrl} alt={goal.description} style={{cursor:"pointer"}}/>
               </a>
                
             </Grid>
            <Grid item xs={7}>
              <GoalCard goal={goal} userId={userId} />
              {userId && goal.user_id._id.toString() === userId.toString() ? (
                <Button
                  size='small'
                  variant='contained'
                  color='primary'
                  onClick={() => navigate(`/goals/${goal._id}/edit`)}
                >
                  Edit Goal
                </Button>
              ) : null}
              {userId && goal.user_id._id.toString() === userId.toString() ? (
                <Button
                  size='small'
                  variant='contained'
                  color='secondary'
                  onClick={() => deleteGoalHandler(goal._id)}
                >
                  Delete Goal
                </Button>
              ) : null}
            </Grid>
          </Grid>
          {}
        </div>
      ))}
    </div>
  );
};

export default AllGoals;
