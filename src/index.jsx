import * as $ from 'jquery';
import Post from '@models/Post';
import json from './assets/json';
import xml from './assets/data.xml';
import csv from './assets/data.csv';
import WebpackLogo from './assets/webpack-logo.png';
import React from 'react';
import { render } from 'react-dom';

import './babel'
import './styles/style.css';
import './styles/less.less';
import './styles/scss.scss';

const post = new Post('Webpack post title', WebpackLogo);

const App = () => (
    <div className="container">
        <h1>Webpack course</h1>
        <hr />
        <div className="logo"></div>
        <hr />
        <pre />
        <div className="box">
            <h2>Less</h2>
        </div>
        <div className="cart">
            <h2>Scss</h2>
        </div>
    </div>
);

render(<App />, document.getElementById('app'));

$('pre').addClass('code').html(post.toString());

// console.log('JSON', json);
// console.log('XML', xml);
// console.log('CSV', csv);
