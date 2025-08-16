// ImportReacts.tsx

import type { JSX } from "react";
import React from "react";
import ReactDOM from "react-dom/client";
import { createRoot } from 'react-dom/client';
import { useState, useEffect, useLayoutEffect } from "react";
import { useCallback, useMemo, useRef, createRef } from "react";
import { createContext, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { memo } from "react";

// -------------------------------------------------------------------------------------------------
export {
  React,
  ReactDOM,
  JSX,
  createRoot,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
  useRef,
  createContext,
  useContext,
  useNavigate,
  useLocation,
  createRef,
  BrowserRouter,
  Routes,
  Route,
	memo,
};