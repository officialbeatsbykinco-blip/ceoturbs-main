import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TextQuiz } from "@/components/quiz/TextQuiz";
import { EMPTY_ANSWERS, textMessage } from "@/content/quiz";
import { smsHref } from "@/lib/sms";
import { cleanLead } from "../../api/_lib/leads.js";

const sendLead = vi.hoisted(() => vi.fn(async () => true));
vi.mock("@/lib/lead-outbox", () => ({ sendLead }));

const asPhone = () => {
  vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true } as MediaQueryList);
  vi.spyOn(navigator, "userAgent", "get").mockReturnValue("iPhone");
};

const answerThree = () => {
  fireEvent.click(screen.getByRole("button", { name: "Local service" }));
  fireEvent.click(screen.getByRole("button", { name: "More calls & bookings" }));
  fireEvent.click(screen.getByRole("button", { name: "Within 30 days" }));
};

const quiz = () =>
  render(
    <MemoryRouter>
      <TextQuiz source="test" />
    </MemoryRouter>,
  );

beforeEach(() => {
  localStorage.clear();
  sendLead.mockClear();
});
afterEach(() => vi.restoreAllMocks());

describe("text quiz", () => {
  it("writes the answers into the message", () => {
    expect(textMessage({ ...EMPTY_ANSWERS, name: " Sam ", audience: "local", stage: "grow", goal: "calls", timeline: "30-days" })).toBe(
      "Hi CEO Turbo! I'm Sam. I run a local service business. What I want: More calls & bookings. Timing: Within 30 days.",
    );
  });

  it("encodes the text for the Messages app", () => {
    expect(smsHref("Calls & more?")).toBe("sms:+16785584327?&body=Calls%20%26%20more%3F");
  });

  it("on a phone, opens Messages with the answers and files the lead without a number", () => {
    asPhone();
    quiz();
    answerThree();
    fireEvent.change(screen.getByLabelText("First name"), { target: { value: "Sam" } });
    const link = screen.getByRole("link", { name: "Text it to us" });
    expect(link.getAttribute("href")).toContain(encodeURIComponent("I'm Sam."));
    fireEvent.click(link);
    fireEvent.click(link);
    expect(sendLead).toHaveBeenCalledTimes(1);
    expect(sendLead.mock.calls[0]).toMatchObject([{ service: "text-quiz", channel: "sms", name: "Sam", goal: "More calls & bookings" }]);
  });

  it("on a phone, asks for a name before sending", () => {
    asPhone();
    quiz();
    answerThree();
    fireEvent.click(screen.getByRole("link", { name: "Text it to us" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Add your first name.");
    expect(sendLead).not.toHaveBeenCalled();
  });

  it("on a computer, asks for a mobile number with consent unticked", () => {
    quiz();
    answerThree();
    expect(screen.queryByRole("link", { name: "Text it to us" })).toBeNull();
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    fireEvent.click(screen.getByRole("button", { name: "Send my answers" }));
    expect(screen.getByText("Enter a valid mobile number.")).toBeInTheDocument();
    expect(sendLead).not.toHaveBeenCalled();
  });

  it("masks the name and phone inputs from session recordings", () => {
    quiz();
    answerThree();
    expect(screen.getByLabelText("First name")).toHaveAttribute("data-clarity-mask", "true");
    expect(screen.getByLabelText("Mobile number")).toHaveAttribute("data-clarity-mask", "true");
  });

  it("keeps the phone number out of saved answers", () => {
    quiz();
    answerThree();
    fireEvent.change(screen.getByLabelText("Mobile number"), { target: { value: "4045550123" } });
    fireEvent.click(screen.getByRole("button", { name: /Back/ }));
    expect(localStorage.getItem("ct_text_quiz_v1")).not.toContain("4045550123");
  });
});

describe("text quiz leads on the server", () => {
  it("takes a name alone only when the options allow it", () => {
    expect(cleanLead({ name: "Sam" }, { phoneOptional: true, emailOptional: true }).lead).toMatchObject({ name: "Sam" });
    expect(cleanLead({ name: "Sam", phone: "4045550123" }).error).toBe("email");
  });
});
