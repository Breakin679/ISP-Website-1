import { useNavigate, useLocation } from "react-router-dom";

/**
 * Returns a function navigateToSection(path, sectionId)
 * - path:   string (e.g. "/fiber") or falsy to reuse current path
 * - sectionId: string (e.g. "plans" or "#plans")
 */
export default function useNavigateToSection() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateToSection = (path, sectionId) => {
    // ensure leading “#”
    const hash = sectionId.startsWith("#") ? sectionId : `#${sectionId}`;
    // build the URL
    const target = path ? `${path}${hash}` : `${location.pathname}${hash}`;
    navigate(target);
  };

  return navigateToSection;
}
