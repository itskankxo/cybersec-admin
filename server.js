const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const crypto = require('crypto-js');
const env = require('dotenv');

env.config();

function encodeData(data) {
    return crypto.AES.encrypt(data, process.env.SECRET_KEY).toString();
}

const app = express();
app.use(bodyParser.json());
const prisma = new PrismaClient();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/user', async (req, res) => {
    try {
        const data = await prisma.$queryRaw`SELECT id, username, cardID FROM user`;
        res.json({ message: 'okay', data });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/user', async (req, res) => {
    try {
        const response = await prisma.user.create({
            data: {
                username: req.body.username,
                password: req.body.password,
                cardID: encodeData(req.body.cardID)
            }
        });
        res.json({ message: 'Add successfully' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Failed to add user' });
    }
});

app.put('/user', async (req, res) => {
    try {
        const response = await prisma.user.update({
            where: { id: req.body.id },
            data: { password: req.body.password }
        });
        res.json({ message: 'Update successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Update failed' });
    }
});

app.delete('/user', async (req, res) => {
    try {
        const response = await prisma.user.delete({
            where: { id: req.body.id }
        });
        res.json({ message: 'Delete successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Delete failed' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
