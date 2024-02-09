import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SecurityDashboard from "src/pages/security/SecurityDashboard";
import { SecurityContext } from "src/context/SecurityContext";

interface MockSwitcherButtonProps {
  handleBtnClick: (value: string) => void;
}

jest.mock("src/component/switcherButton", () => {
  const MockSwitcherButton: React.FC<MockSwitcherButtonProps> = ({
    handleBtnClick,
  }) => (
    <button onClick={() => handleBtnClick("mock-value")}>
      Mock SwitcherButton
    </button>
  );
  MockSwitcherButton.displayName = "MockSwitcherButton";
  return MockSwitcherButton;
});

jest.mock("src/component/workspaceDropdown", () => {
  const MockWorkspaceDropdown = () => <div>Mock WorkspaceDropdown</div>;
  MockWorkspaceDropdown.displayName = "MockWorkspaceDropdown";
  return MockWorkspaceDropdown;
});

describe("SecurityDashboard", () => {
  const mockContextValue = {
    setRunType: jest.fn(),
    workspace: "mock-workspace",
    runType: "mock-runType",
    setWorkspace: jest.fn(),
    appId: "mock-app",
    setAppId: jest.fn(),
  };

  it("renders correctly", () => {
    render(
      <SecurityContext.Provider value={mockContextValue}>
        <SecurityDashboard
          title={"Security Dashboard"}
          showWorkspaceDropdown={true}
        />
      </SecurityContext.Provider>
    );

    expect(screen.getByText("Security Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Mock WorkspaceDropdown")).toBeInTheDocument();
  });

  it("interacts with SecurityContext correctly", () => {
    render(
      <SecurityContext.Provider value={mockContextValue}>
        <SecurityDashboard
          title={"Security Dashboard"}
          showWorkspaceDropdown={true}
        />
      </SecurityContext.Provider>
    );

    fireEvent.click(screen.getByText("Mock SwitcherButton"));
    expect(mockContextValue.setRunType).toHaveBeenCalledWith("mock-value");
  });
});
