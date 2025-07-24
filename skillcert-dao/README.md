# SkillCert DAO

A decentralized platform for **verifiable skill certifications**, allowing learners, professionals, educators, and employers to interact in a trustless, tamper-proof credentialing system — built on Bitcoin via the **Stacks blockchain** using **Clarity smart contracts**.

---

## 🌐 Problem It Solves

- Lack of verifiable, global credentials for freelancers and job seekers.
- Centralized certificate systems are prone to fraud and gatekeeping.
- Employers have no transparent way to verify skills or work history.
- Educators have no decentralized platform to issue recognized certifications.

---

## ✅ Key Features

- 🎓 Mint skill certificates as non-transferable NFTs (SBTs).
- 🏆 Peer and expert endorsement system on-chain.
- 🧠 Proof of experience via project/work verification.
- 🗳 DAO-based governance using Stacks voting or SIP-012 models.
- 🔒 Decentralized identity integration (e.g., BNS or decentralized identifiers).
- 🔍 Employer credential verification dashboard.

---

## 📦 Smart Contract Architecture (Clarity)

### 1. `user-identity.clar`
- Registers users with a Decentralized Identifier (DID or BNS).
- Links wallet to public profile data.

### 2. `skill-nft.clar`
- Mints non-transferable NFTs (SBTs) representing verified skills.
- Metadata includes skill level, issuer, score, date.

### 3. `course-registry.clar`
- Registry of whitelisted learning programs and course metadata.
- Enables course completion tracking for NFT issuance.

### 4. `assessment-engine.clar`
- Stores results of peer-reviewed or auto-graded assessments.
- Emits events for `skill-nft.clar` to mint upon validation.

### 5. `endorsement.clar`
- Allows verified users to endorse skills of peers with on-chain approval.
- Limited by role or prior reputation token holding.

### 6. `experience-proof.clar`
- Stores proof of work/project experience as verifiable credentials.
- Tied to skill NFTs via unique identifiers.

### 7. `certification-dao.clar`
- A simple DAO contract to manage validator onboarding, rules, and voting.
- Built with `trait` definitions for voting modules.

### 8. `reputation-token.clar`
- Non-transferable fungible tokens for reputation scoring.
- Used to gate certain actions (e.g., endorsing others, DAO voting).

### 9. `employer-access.clar`
- Employers request access to view and verify skills.
- Optional access gating using on-chain permission lists.

### 10. `dispute-resolution.clar`
- Allows users to raise disputes on fraudulent skill claims.
- Resolved through DAO vote or via trusted arbitration smart contract.

---

## 🔧 Tech Stack

- **Smart Contracts**: Clarity (Stacks 2.1+)
- **Frontend**: React / Next.js + `@stacks/connect` for authentication
- **Storage**: Gaia / IPFS for off-chain metadata
- **Identity**: BNS (Bitcoin Name System) or Ceramic DID
- **Governance**: SIP-012 compliant DAO contract or external tools (Stacks.js DAO)
- **Testing/Deployment**: Clarinet (Hiro Systems)

---

## 🔐 Sample Use Case

1. Sarah completes a blockchain dev course registered on `course-registry.clar`.
2. She submits a project and passes a test; `assessment-engine.clar` records her results.
3. `skill-nft.clar` mints a non-transferable NFT: `Skill: Clarity Smart Contract Dev – Level 2`.
4. Her mentor endorses her via `endorsement.clar`.
5. She logs prior freelance experience with `experience-proof.clar`.
6. Her profile becomes verifiable on-chain by employers using `employer-access.clar`.

---

## 📈 Roadmap

- [x] Design Clarity contract architecture
- [x] Deploy devnet contracts using Clarinet
- [x] Build frontend UI for skill verification
- [ ] Integrate with BNS and Gaia for identity & metadata
- [ ] Launch DAO contract and community governance
- [ ] Launch mainnet beta

---

## 👥 Contributing

Want to contribute to the future of decentralized credentials on Bitcoin?

1. Fork the repo
2. Install dependencies: `npm install` or `pnpm install`
3. Run tests: `clarinet test`
4. Open a PR or submit issues


