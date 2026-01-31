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
import AIControlCenter from './pages/AIControlCenter';
import AIEnginesList from './pages/AIEnginesList';
import AIModelsConfig from './pages/AIModelsConfig';
import AITestingEnvironment from './pages/AITestingEnvironment';
import AdvancedParametersManager from './pages/AdvancedParametersManager';
import BusinessPreparation from './pages/BusinessPreparation';
import CollaborativeWorkspace from './pages/CollaborativeWorkspace';
import CompanyManagement from './pages/CompanyManagement';
import DocumentGenerator from './pages/DocumentGenerator';
import FileActions from './pages/FileActions';
import GameWorldGenerator from './pages/GameWorldGenerator';
import Home from './pages/Home';
import ImageEditor from './pages/ImageEditor';
import ImageGenerator from './pages/ImageGenerator';
import MediaGenerator from './pages/MediaGenerator';
import NeuronsList from './pages/NeuronsList';
import OSPrincipal from './pages/OSPrincipal';
import PDFEditor from './pages/PDFEditor';
import ParametersDiagram from './pages/ParametersDiagram';
import PresentationGenerator from './pages/PresentationGenerator';
import ProactiveAgents from './pages/ProactiveAgents';
import SystemFunctionalities from './pages/SystemFunctionalities';
import TextEditor from './pages/TextEditor';
import VideoGenerator from './pages/VideoGenerator';
import VoiceCommandsList from './pages/VoiceCommandsList';
import WindowCreator from './pages/WindowCreator';
import WindowManager from './pages/WindowManager';
import ProactiveAgentsCreator from './pages/ProactiveAgentsCreator';
import AutoBugDetector from './pages/AutoBugDetector';
import ContentVerifiers from './pages/ContentVerifiers';
import OSOrchestrator from './pages/OSOrchestrator';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AIAutoDevelopment": AIAutoDevelopment,
    "AIControlCenter": AIControlCenter,
    "AIEnginesList": AIEnginesList,
    "AIModelsConfig": AIModelsConfig,
    "AITestingEnvironment": AITestingEnvironment,
    "AdvancedParametersManager": AdvancedParametersManager,
    "BusinessPreparation": BusinessPreparation,
    "CollaborativeWorkspace": CollaborativeWorkspace,
    "CompanyManagement": CompanyManagement,
    "DocumentGenerator": DocumentGenerator,
    "FileActions": FileActions,
    "GameWorldGenerator": GameWorldGenerator,
    "Home": Home,
    "ImageEditor": ImageEditor,
    "ImageGenerator": ImageGenerator,
    "MediaGenerator": MediaGenerator,
    "NeuronsList": NeuronsList,
    "OSPrincipal": OSPrincipal,
    "PDFEditor": PDFEditor,
    "ParametersDiagram": ParametersDiagram,
    "PresentationGenerator": PresentationGenerator,
    "ProactiveAgents": ProactiveAgents,
    "SystemFunctionalities": SystemFunctionalities,
    "TextEditor": TextEditor,
    "VideoGenerator": VideoGenerator,
    "VoiceCommandsList": VoiceCommandsList,
    "WindowCreator": WindowCreator,
    "WindowManager": WindowManager,
    "ProactiveAgentsCreator": ProactiveAgentsCreator,
    "AutoBugDetector": AutoBugDetector,
    "ContentVerifiers": ContentVerifiers,
    "OSOrchestrator": OSOrchestrator,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};