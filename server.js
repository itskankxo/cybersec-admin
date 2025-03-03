const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
const prisma = new PrismaClient();
const port = 3004


app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/user',async (req, res) => {
    const data = await prisma.user.findMany();
    res.json({
        message: 'okay',
        data 
    })
});

app.post('/user', async (req, res) => {
    console.log(req.body)
    const response = await prisma.user.create({
      data:{  username: req.body.username,
        password: req.body.password
      }
    });
    if(response) {
        res.json({
            message: "add successfully"
        })
    }else {
        res.json({
            message: 'failed'
        })
    }

});

app.put('/user/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const { username, password } = req.body;

      let updateData = {};
      if (username) updateData.username = username;
      if (password) updateData.password = password;
      const response = await prisma.user.update({
          where: { id: Number(id) },
          data: updateData
      });

      res.json({
          message: "User updated successfully",
          user: response
      });
  } catch (error) {
      res.status(500).json({
          message: "Error updating user",
          error: error.message
      });
  }
});

app.delete('/user/:id', async (req, res) => {
  try {
      const { id } = req.params;
      
      await prisma.user.delete({
          where: { id: Number(id) }
      });

      res.json({
          message: "User deleted successfully"
      });
  } catch (error) {
      res.status(500).json({
          message: "Error deleting user",
          error: error.message
      });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

