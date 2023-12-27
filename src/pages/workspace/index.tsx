// pages/workspace/index.js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

interface ProjectDetails {
  [key: string]: string;
}

const projectDetails: ProjectDetails = {
//   'project-x': ' Project X',
//   'project-y': ' Project Y',
};

const Workspace = () => {
  const router = useRouter();
  const { query } = router;

  // Extract project identifier from the query parameter
  const projectId = Array.isArray(query.project) ? query.project[0] : query.project;

  // State to manage the current project
  const [currentProject, setCurrentProject] = useState<string | null>(projectId || null);

  useEffect(() => {
    // Update the current project when the query parameter changes
    setCurrentProject(projectId || null);
  }, [projectId]);

  // Fetch project details based on the current project
  const projectDetail = currentProject ? projectDetails[currentProject] : null;

  return (
    <div>
      {currentProject ? (
        <h1>{` ${currentProject}`}</h1>
      ) : (
        <h1>Workspace Component</h1>
      )}
      {projectDetail && <p>{projectDetail}</p>}
    </div>
  );
};

export default Workspace;
