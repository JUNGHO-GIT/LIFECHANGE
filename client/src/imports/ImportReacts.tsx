// ImportReacts.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { StrictMode } from 'react';
import { Suspense, lazy } from "react";
import { useState, useEffect, useLayoutEffect } from "react";
import { useCallback, useMemo, useRef, createRef } from "react";
import { createContext, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// -------------------------------------------------------------------------------------------------
export {
  React,
  ReactDOM,
  StrictMode,
  Suspense,
  lazy,
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
  Route
};