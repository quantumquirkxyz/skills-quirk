---
name: networking
category: networking
maturity: stable
version: 1
description: Design and analyze network infrastructure — TCP/IP, routing, DNS, load balancing, firewalls, VPNs, network security — with explicit assumptions about latency, bandwidth, and failure modes.
capabilities:
  - apply networking workflow
  - produce networking artifact
  - validate networking completion criteria
outputs:
  - Networking artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Design and analyze network infrastructure complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

# networking

Design and analyze network infrastructure — TCP/IP, routing, DNS, load balancing, firewalls, VPNs, network security — with explicit assumptions about latency, bandwidth, and failure modes.

## Goals
- Design network topology with explicit redundancy
- Choose protocols appropriate to latency and reliability requirements
- Plan for network security (segmentation, firewalls, monitoring)
- Diagnose connectivity issues systematically

## Contract

### Input
A system to design or diagnose: topology, protocols, traffic patterns, security requirements.

### Output
A network design document with:
- Topology diagram (physical and logical)
- Protocol selection rationale
- Security controls
- Monitoring and failure response plan

## Layers

| Layer | Protocol examples | Focus |
|---|---|---|
| Application | HTTP, gRPC, MQTT, WebSocket | Business logic |
| Transport | TCP, UDP, QUIC | Reliability vs. speed |
| Internet | IP, ICMP, BGP | Routing, addressing |
| Link | Ethernet, WiFi, LTE | Physical delivery |

## Common Patterns

| Pattern | Use case | Trade-off |
|---|---|---|
| Load balancer | Distribute traffic | Latency, cost |
| CDN | Static content, low latency | Cache invalidation |
| VPN tunnel | Secure remote access | Encryption overhead |
| Reverse proxy | SSL termination, caching | Single point of failure |

## Steps

1. **Map the network topology** — who talks to whom, where
2. **Profile traffic** — latency, bandwidth, burst patterns
3. **Choose protocols** — TCP for reliability, UDP for speed
4. **Design security** — segmentation, firewall rules, monitoring
5. **Plan for failure** — redundancy, failover, disaster recovery
6. **Document** — topology, IP ranges, DNS, routing rules

## Rules

- Rule: map who talks to whom before choosing protocols or appliances.
- Rule: state latency, bandwidth, reliability, and security assumptions.
- Rule: separate topology, routing, DNS, load balancing, and firewall concerns.
- Rule: include redundancy, failover, and monitoring for critical paths.
- Rule: document IP ranges, ownership, and change-control expectations.

## References
- `../os/SKILL.md` — network stack in OS
- `../../devops/devops-k8s-orchestration/SKILL.md` — k8s networking
- `../../sec/sec-threat-modeling/SKILL.md` — network threats
