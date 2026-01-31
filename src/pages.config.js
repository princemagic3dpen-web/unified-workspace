/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AIAutoDevelopment from './pages/AIAutoDevelopment';
import AIModelsConfig from './pages/AIModelsConfig';
import CollaborativeWorkspace from './pages/CollaborativeWorkspace';
import DocumentGenerator from './pages/DocumentGenerator';
import FileActions from './pages/FileActions';
import Home from './pages/Home';
import ImageEditor from './pages/ImageEditor';
import PDFEditor from './pages/PDFEditor';
import PresentationGenerator from './pages/PresentationGenerator';
import TextEditor from './pages/TextEditor';
import AITestingEnvironment from './pages/AITestingEnvironment';
import WindowManager from './pages/WindowManager';
import SystemFunctionalities from './pages/SystemFunctionalities';
import BusinessPreparation from './pages/BusinessPreparation';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AIAutoDevelopment": AIAutoDevelopment,
    "AIModelsConfig": AIModelsConfig,
    "CollaborativeWorkspace": CollaborativeWorkspace,
    "DocumentGenerator": DocumentGenerator,
    "FileActions": FileActions,
    "Home": Home,
    "ImageEditor": ImageEditor,
    "PDFEditor": PDFEditor,
    "PresentationGenerator": PresentationGenerator,
    "TextEditor": TextEditor,
    "AITestingEnvironment": AITestingEnvironment,
    "WindowManager": WindowManager,
    "SystemFunctionalities": SystemFunctionalities,
    "BusinessPreparation": BusinessPreparation,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};