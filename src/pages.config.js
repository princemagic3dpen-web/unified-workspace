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
import AICollaborationHub from './pages/AICollaborationHub';
import AIControlCenter from './pages/AIControlCenter';
import AIEnginesList from './pages/AIEnginesList';
import AIModelsConfig from './pages/AIModelsConfig';
import AIOrchestrator from './pages/AIOrchestrator';
import AITestingEnvironment from './pages/AITestingEnvironment';
import AIToolsHub from './pages/AIToolsHub';
import AdvancedImageGenerator from './pages/AdvancedImageGenerator';
import AdvancedParametersManager from './pages/AdvancedParametersManager';
import AutoBugDetector from './pages/AutoBugDetector';
import BusinessPreparation from './pages/BusinessPreparation';
import CollaborativeWorkspace from './pages/CollaborativeWorkspace';
import CompanyManagement from './pages/CompanyManagement';
import ContentVerifiers from './pages/ContentVerifiers';
import DocumentGenerator from './pages/DocumentGenerator';
import FileActions from './pages/FileActions';
import GameWorldGenerator from './pages/GameWorldGenerator';
import GrokIntegration from './pages/GrokIntegration';
import Home from './pages/Home';
import ImageEditor from './pages/ImageEditor';
import ImageGenerator from './pages/ImageGenerator';
import MathematicalVerifier from './pages/MathematicalVerifier';
import MediaGenerator from './pages/MediaGenerator';
import MusicGeneratorPro from './pages/MusicGeneratorPro';
import NeuronsList from './pages/NeuronsList';
import OSOrchestrator from './pages/OSOrchestrator';
import OSPrincipal from './pages/OSPrincipal';
import OSTableOfContents from './pages/OSTableOfContents';
import PDFEditor from './pages/PDFEditor';
import ParametersDiagram from './pages/ParametersDiagram';
import PresentationGenerator from './pages/PresentationGenerator';
import ProactiveAgents from './pages/ProactiveAgents';
import ProactiveAgentsCreator from './pages/ProactiveAgentsCreator';
import SystemFunctionalities from './pages/SystemFunctionalities';
import TextEditor from './pages/TextEditor';
import UnlimitedIQVerifier from './pages/UnlimitedIQVerifier';
import VideoGenerator from './pages/VideoGenerator';
import VoiceCommandsList from './pages/VoiceCommandsList';
import VoiceSystemControl from './pages/VoiceSystemControl';
import WindowCreator from './pages/WindowCreator';
import WindowManager from './pages/WindowManager';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AIAutoDevelopment": AIAutoDevelopment,
    "AICollaborationHub": AICollaborationHub,
    "AIControlCenter": AIControlCenter,
    "AIEnginesList": AIEnginesList,
    "AIModelsConfig": AIModelsConfig,
    "AIOrchestrator": AIOrchestrator,
    "AITestingEnvironment": AITestingEnvironment,
    "AIToolsHub": AIToolsHub,
    "AdvancedImageGenerator": AdvancedImageGenerator,
    "AdvancedParametersManager": AdvancedParametersManager,
    "AutoBugDetector": AutoBugDetector,
    "BusinessPreparation": BusinessPreparation,
    "CollaborativeWorkspace": CollaborativeWorkspace,
    "CompanyManagement": CompanyManagement,
    "ContentVerifiers": ContentVerifiers,
    "DocumentGenerator": DocumentGenerator,
    "FileActions": FileActions,
    "GameWorldGenerator": GameWorldGenerator,
    "GrokIntegration": GrokIntegration,
    "Home": Home,
    "ImageEditor": ImageEditor,
    "ImageGenerator": ImageGenerator,
    "MathematicalVerifier": MathematicalVerifier,
    "MediaGenerator": MediaGenerator,
    "MusicGeneratorPro": MusicGeneratorPro,
    "NeuronsList": NeuronsList,
    "OSOrchestrator": OSOrchestrator,
    "OSPrincipal": OSPrincipal,
    "OSTableOfContents": OSTableOfContents,
    "PDFEditor": PDFEditor,
    "ParametersDiagram": ParametersDiagram,
    "PresentationGenerator": PresentationGenerator,
    "ProactiveAgents": ProactiveAgents,
    "ProactiveAgentsCreator": ProactiveAgentsCreator,
    "SystemFunctionalities": SystemFunctionalities,
    "TextEditor": TextEditor,
    "UnlimitedIQVerifier": UnlimitedIQVerifier,
    "VideoGenerator": VideoGenerator,
    "VoiceCommandsList": VoiceCommandsList,
    "VoiceSystemControl": VoiceSystemControl,
    "WindowCreator": WindowCreator,
    "WindowManager": WindowManager,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};