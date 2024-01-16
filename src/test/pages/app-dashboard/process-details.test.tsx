import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ProcessDetails from "src/pages/workspace/app-dashboard/ProcessDetails";
import "@testing-library/jest-dom";

describe("ProcessDetails component", () => {
  const mockData = {
    supplyChainStepData: {
      stage: "clone",
      status: "Succeeded",
      duration: "1 hour 30 min 15 sec",
      started_at: "2023-10-26T18:24:54.000Z",
      completed_at: "2023-10-26T19:54:09.000Z",
      steps: [],
      result: [],
      step_name: "",
    },
    loading: false,
    gitRepo: "MyOrgTest12/api",
    gitBranch: "main",
  };

  it("renders the component with provided data", () => {
    render(<ProcessDetails handleTrigger={undefined} {...mockData} />);
    expect(screen.getByTestId("card")).toBeInTheDocument();
    expect(screen.getByTestId("stage-summary")).toHaveTextContent(
      "Stage Summary"
    );
    expect(screen.getByTestId("stage")).toHaveTextContent("Stage: clone");
    expect(screen.getByTestId("duration")).toHaveTextContent(
      "Duration: 1 hour 29 min 15 sec"
    );
    expect(screen.getByTestId("status")).toHaveTextContent("Status: Succeeded");
    expect(screen.getByTestId("gitrepo")).toHaveTextContent(
      "Git Repo: MyOrgTest12/api"
    );
    expect(screen.getByTestId("branch")).toHaveTextContent("Branch: main");
    expect(screen.getByTestId("date")).toHaveTextContent(
      "Date: 26/10/2023, 11:54:54 pm"
    );
  });

  it("renders loading state", () => {
    render(
      <ProcessDetails handleTrigger={undefined} {...mockData} loading={true} />
    );
    expect(screen.queryByTestId("stage")).not.toBeInTheDocument();
    expect(screen.queryByTestId("duration")).not.toBeInTheDocument();
    expect(screen.queryByTestId("status")).not.toBeInTheDocument();
    expect(screen.queryByTestId("gitrepo")).not.toBeInTheDocument();
    expect(screen.queryByTestId("commit")).not.toBeInTheDocument();
    expect(screen.queryByTestId("branch")).not.toBeInTheDocument();
    expect(screen.queryByTestId("date")).not.toBeInTheDocument();
  });

  // it('renders without crashing', () => {
  //   render(<ProcessDetails handleTrigger={undefined} {...mockData} />);
  //   expect(screen.getByTestId('result')).toBeInTheDocument();
  // });

  // it('renders result section when data is available', () => {
  //   render(<ProcessDetails handleTrigger={undefined} {...mockData} />);
  //   expect(screen.getByTestId('result')).toBeInTheDocument();
  //   expect(screen.getByText('Result')).toBeInTheDocument();
  // });

  // it('renders approval section when status is pending', () => {
  //   render(<ProcessDetails handleTrigger={undefined} {...mockData} />);
  //   expect(screen.getByTestId('approval')).toBeInTheDocument();
  //   expect(screen.getByLabelText('Comment')).toBeInTheDocument();
  //   expect(screen.getByText('Approval')).toBeInTheDocument();
  //   expect(screen.getByText('Reject')).toBeInTheDocument();
  // });

  // it('opens confirmation dialog on approve click', async () => {
  //   render(<ProcessDetails handleTrigger={undefined} {...mockData} />);
  //   fireEvent.click(screen.getByTestId('approve'));

  //   expect(screen.getByText('Are you sure you want to Approve')).toBeInTheDocument();

  //   fireEvent.click(screen.getByTestId('cancel'));

  //   await waitFor(() => {
  //     expect(screen.queryByText('Are you sure you want to Approve')).toBeNull();
  //   });
  // });

  // it('submits approval on dialog ok click', async () => {
  //   const mockSubmitApproval = jest.fn();

  //   render(<ProcessDetails handleTrigger={mockSubmitApproval} {...mockData} />);

  //   fireEvent.click(screen.getByTestId('approve'));
  //   fireEvent.click(screen.getByTestId('ok'));

  //   await waitFor(() => {
  //     expect(mockSubmitApproval).toHaveBeenCalled();
  //   });
  //   await waitFor(() => {
  //     expect(screen.queryByText('Are you sure you want to Approve')).toBeNull();
  //   });
  // });
});