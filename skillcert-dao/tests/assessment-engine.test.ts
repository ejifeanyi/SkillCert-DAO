// assessment-engine.test.ts
import { describe, it, expect, beforeEach } from "vitest";

type AssessmentKey = { user: string; skillId: number };
type AssessmentResult = { score: number; passed: boolean };

const mockContract = {
  admin: "ST1ADMINADDRESS1234567890",
  thresholds: new Map<number, number>(),
  assessments: new Map<string, AssessmentResult>(),

  makeKey(user: string, skillId: number): string {
    return `${user}_${skillId}`;
  },

  isAdmin(caller: string) {
    return caller === this.admin;
  },

  setThreshold(caller: string, skillId: number, threshold: number) {
    if (!this.isAdmin(caller)) {
      return { error: 100 }; // ERR-NOT-AUTHORIZED
    }
    this.thresholds.set(skillId, threshold);
    return { value: true };
  },

  submitAssessment(caller: string, skillId: number, score: number) {
    const key = this.makeKey(caller, skillId);
    if (this.assessments.has(key)) {
      return { error: 101 }; // ERR-ALREADY-SUBMITTED
    }

    const threshold = this.thresholds.get(skillId);
    if (threshold === undefined) {
      return { error: 102 }; // ERR-INVALID-SKILL
    }

    const passed = score >= threshold;
    this.assessments.set(key, { score, passed });
    return { value: passed };
  },

  getAssessment(user: string, skillId: number) {
    const key = this.makeKey(user, skillId);
    const result = this.assessments.get(key);
    if (!result) {
      return { error: 103 }; // ERR-NOT-FOUND
    }
    return { value: result };
  },

  didPass(user: string, skillId: number) {
    const key = this.makeKey(user, skillId);
    const result = this.assessments.get(key);
    if (!result) {
      return { error: 103 };
    }
    return { value: result.passed };
  },

  transferAdmin(caller: string, newAdmin: string) {
    if (!this.isAdmin(caller)) {
      return { error: 100 };
    }
    this.admin = newAdmin;
    return { value: true };
  },
};

describe("Assessment Engine Contract", () => {
  const admin = "ST1ADMINADDRESS1234567890";
  const user = "ST2USERADDRESS1234567890";

  beforeEach(() => {
    mockContract.admin = admin;
    mockContract.thresholds = new Map();
    mockContract.assessments = new Map();
  });

  it("should allow admin to set skill threshold", () => {
    const result = mockContract.setThreshold(admin, 1, 70);
    expect(result).toEqual({ value: true });
    expect(mockContract.thresholds.get(1)).toBe(70);
  });

  it("should not allow non-admin to set threshold", () => {
    const result = mockContract.setThreshold(user, 1, 70);
    expect(result).toEqual({ error: 100 });
  });

  it("should submit and pass assessment if score >= threshold", () => {
    mockContract.setThreshold(admin, 2, 60);
    const result = mockContract.submitAssessment(user, 2, 75);
    expect(result).toEqual({ value: true });

    const assessment = mockContract.getAssessment(user, 2);
    expect(assessment).toEqual({ value: { score: 75, passed: true } });
  });

  it("should fail assessment if score < threshold", () => {
    mockContract.setThreshold(admin, 3, 90);
    const result = mockContract.submitAssessment(user, 3, 80);
    expect(result).toEqual({ value: false });

    const passCheck = mockContract.didPass(user, 3);
    expect(passCheck).toEqual({ value: false });
  });

  it("should not allow re-submitting same assessment", () => {
    mockContract.setThreshold(admin, 4, 85);
    mockContract.submitAssessment(user, 4, 90);

    const result = mockContract.submitAssessment(user, 4, 95);
    expect(result).toEqual({ error: 101 });
  });

  it("should return error if skill threshold is not set", () => {
    const result = mockContract.submitAssessment(user, 99, 88);
    expect(result).toEqual({ error: 102 });
  });

  it("should transfer admin rights", () => {
    const newAdmin = "ST3NEWADMIN1234567890";
    const result = mockContract.transferAdmin(admin, newAdmin);
    expect(result).toEqual({ value: true });

    const setResult = mockContract.setThreshold(newAdmin, 5, 60);
    expect(setResult).toEqual({ value: true });
  });
});
