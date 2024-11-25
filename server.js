const express = require('express');
const app = require('./src/app');
const PORT = 3055;

app.listen(PORT, () => {
    console.log('Server is running on port 3055');
})