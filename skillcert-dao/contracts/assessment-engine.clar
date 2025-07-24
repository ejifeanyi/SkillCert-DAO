;; Assessment Engine Contract
;; Manages skill assessments for certification minting

(define-data-var admin principal tx-sender)

;; Stores submitted assessments and results
(define-map assessments
  { user: principal, skill-id: uint }
  { score: uint, passed: bool })

;; Define passing score threshold per skill (customizable)
(define-map skill-thresholds uint uint)

;; Error codes
(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-ALREADY-SUBMITTED u101)
(define-constant ERR-INVALID-SKILL u102)
(define-constant ERR-NOT-FOUND u103)

;; Private check for admin
(define-private (is-admin)
  (is-eq tx-sender (var-get admin)))

;; Set a passing score threshold for a skill
(define-public (set-threshold (skill-id uint) (threshold uint))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (map-set skill-thresholds skill-id threshold)
    (ok true)))

;; Submit assessment for a skill
(define-public (submit-assessment (skill-id uint) (score uint))
  (let (
    (existing (map-get? assessments { user: tx-sender, skill-id: skill-id }))
    (threshold (map-get? skill-thresholds skill-id))
  )
    (begin
      (asserts! (is-none existing) (err ERR-ALREADY-SUBMITTED))
      (match threshold
        threshold-val
          (let ((passed (>= score threshold-val)))
            (map-set assessments { user: tx-sender, skill-id: skill-id } { score: score, passed: passed })
            (ok passed))
        (err ERR-INVALID-SKILL)))))

;; Read assessment result
(define-read-only (get-assessment (user principal) (skill-id uint))
  (match (map-get? assessments { user: user, skill-id: skill-id })
    result (ok result)
    (err ERR-NOT-FOUND)))

;; Check if user passed a skill
(define-read-only (did-pass (user principal) (skill-id uint))
  (match (map-get? assessments { user: user, skill-id: skill-id })
    result (ok (get passed result))
    (err ERR-NOT-FOUND)))

;; Transfer admin rights
(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (var-set admin new-admin)
    (ok true)))