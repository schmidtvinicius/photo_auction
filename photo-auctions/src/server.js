import express from 'express';
import compression from 'compression';
import * as sapper from '@sapper/server';

import api from './REST/api.js'
import login from './authentication/login.js'
import register from './authentication/register.js'

const { PORT } = process.env;

express()
	.use(
		compression({threshold: 0}),
		express.json()
	)
	.use('/api', api)
	.put('/credentials', login)
	.post('/register', register)
	.use(sapper.middleware())
	.use(express.static('static'))
	.listen(PORT, err => {
		if(err){
			console.log('error', err)
		}
	})
