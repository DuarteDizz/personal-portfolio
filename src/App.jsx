import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from '@/Layout.jsx';

import Home from '@/Pages/Home.jsx';
import Projects from '@/Pages/Projects.jsx';
import Skills from '@/Pages/Skills.jsx';
import About from '@/Pages/About.jsx';
// import Blog from '@/Pages/Blog.jsx';
import Contact from '@/Pages/Contact.jsx';

export default function App() {
  return (
    <BrowserRouter basename="/personal-portfolio">
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/about" element={<About />} />
          {/* <Route path="/blog" element={<Blog />} /> */}
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
