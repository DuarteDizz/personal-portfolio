import React from 'react';

export function USFlag({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" fill="#B22234"/>
      <path d="M0,3.08h60M0,9.23h60M0,15.38h60M0,21.54h60M0,27.69h60M0,33.85h60" stroke="#fff" strokeWidth="3.08"/>
      <rect width="24" height="17.5" fill="#3C3B6E"/>
      <g fill="#fff">
        <circle cx="4" cy="3" r="0.8"/>
        <circle cx="8" cy="3" r="0.8"/>
        <circle cx="12" cy="3" r="0.8"/>
        <circle cx="16" cy="3" r="0.8"/>
        <circle cx="20" cy="3" r="0.8"/>
        <circle cx="6" cy="5.5" r="0.8"/>
        <circle cx="10" cy="5.5" r="0.8"/>
        <circle cx="14" cy="5.5" r="0.8"/>
        <circle cx="18" cy="5.5" r="0.8"/>
        <circle cx="4" cy="8" r="0.8"/>
        <circle cx="8" cy="8" r="0.8"/>
        <circle cx="12" cy="8" r="0.8"/>
        <circle cx="16" cy="8" r="0.8"/>
        <circle cx="20" cy="8" r="0.8"/>
        <circle cx="6" cy="10.5" r="0.8"/>
        <circle cx="10" cy="10.5" r="0.8"/>
        <circle cx="14" cy="10.5" r="0.8"/>
        <circle cx="18" cy="10.5" r="0.8"/>
        <circle cx="4" cy="13" r="0.8"/>
        <circle cx="8" cy="13" r="0.8"/>
        <circle cx="12" cy="13" r="0.8"/>
        <circle cx="16" cy="13" r="0.8"/>
        <circle cx="20" cy="13" r="0.8"/>
        <circle cx="6" cy="15.5" r="0.8"/>
        <circle cx="10" cy="15.5" r="0.8"/>
        <circle cx="14" cy="15.5" r="0.8"/>
        <circle cx="18" cy="15.5" r="0.8"/>
      </g>
    </svg>
  );
}

export function BrazilFlag({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" fill="#009B3A"/>
      <path d="M30,5 L55,20 L30,35 L5,20 Z" fill="#FEDF00"/>
      <circle cx="30" cy="20" r="8" fill="#002776"/>
      <path d="M24,18 Q30,14 36,18" stroke="#fff" strokeWidth="0.8" fill="none"/>
      <circle cx="28" cy="16" r="0.6" fill="#fff"/>
      <circle cx="32" cy="16" r="0.6" fill="#fff"/>
      <circle cx="30" cy="20" r="0.6" fill="#fff"/>
      <circle cx="26" cy="22" r="0.6" fill="#fff"/>
      <circle cx="34" cy="22" r="0.6" fill="#fff"/>
    </svg>
  );
}