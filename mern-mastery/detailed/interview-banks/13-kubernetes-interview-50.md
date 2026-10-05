# Kubernetes, Docker, Cloud, and Observability Interview — 50 Questions

This bank covers Docker, Kubernetes (K8s), Amazon Web Services (AWS) basics, and observability for product company interviews. Spell out abbreviations on first use.

## 1. What is Docker and why is it used?

Docker is a platform for building, shipping, and running applications in lightweight, portable containers. Containers package application code with all dependencies (libraries, runtime) ensuring consistent behavior across development, testing, and production. Docker solves "it works on my machine" problems and enables microservices deployment at scale.

## 2. What is the difference between a container and a virtual machine (VM)?

A Virtual Machine (VM) runs a full guest operating system on a hypervisor—heavy (gigabytes), slow to start (minutes). A container shares the host operating system kernel, isolating only the application and its dependencies—lightweight (megabytes), fast to start (seconds). Containers are ideal for microservices; VMs for running different operating systems or strong isolation requirements.

## 3. What is a Docker image vs a container?

A Docker image is an immutable template (blueprint) containing application code, runtime, libraries, and configuration—stored in layers for efficient caching. A container is a running instance of an image—mutable, with its own filesystem, network, and process space. Analogy: image is a class, container is an object. You can run multiple containers from one image.

## 4. What is a Dockerfile?

A Dockerfile is a text file with instructions to build a Docker image: `FROM` (base image), `COPY` (add files), `RUN` (execute commands), `EXPOSE` (port), `CMD` (default command). Example: `FROM node:20`, `COPY . /app`, `RUN npm install`, `CMD ["node", "server.js"]`. Build with `docker build -t myapp .`. Best practices: multi-stage builds, non-root user, minimal base images.

## 5. What is Docker Compose?

Docker Compose defines and runs multi-container applications using a YAML (YAML Ain't Markup Language) file. Specify services (web, database, cache), networks, and volumes in `docker-compose.yml`. Run with `docker compose up`. Ideal for local development environments replicating production topology. Not for production orchestration—use Kubernetes instead.

## 6. What is Kubernetes (K8s)?

Kubernetes (K8s—K plus 8 letters plus s) is an open-source container orchestration platform that automates deployment, scaling, and management of containerized applications. Originally from Google, now maintained by Cloud Native Computing Foundation (CNCF). Handles scheduling containers across nodes, self-healing (restart failed containers), rolling updates, and service discovery. Industry standard for production container workloads.

## 7. What is a Kubernetes pod?

A pod is the smallest deployable unit in Kubernetes—one or more containers sharing network and storage. Containers in a pod share localhost and volumes. Usually one container per pod (one process per pod principle). Pods are ephemeral—Kubernetes creates new pods when old ones die. Deployments manage pod lifecycle.

## 8. What is a Kubernetes Deployment?

A Deployment manages a set of identical pods, handling rolling updates, rollbacks, and scaling. Define desired replica count and container spec in YAML. Kubernetes continuously reconciles actual state to desired state. `kubectl apply -f deployment.yaml` creates or updates. Use Deployments for stateless applications (web servers, APIs).

## 9. What is a Kubernetes Service?

A Service provides a stable network endpoint (IP address and DNS name) for a set of pods. Types: ClusterIP (internal only), NodePort (expose on node port), LoadBalancer (cloud provider load balancer), ExternalName. Pods come and go; Services route traffic to healthy pods via label selectors. Essential because pod IPs change on restart.

## 10. What is an Ingress in Kubernetes?

An Ingress manages external HTTP/HTTPS (Hypertext Transfer Protocol Secure) access to cluster services. Defines routing rules (host, path) to backend services. Requires an Ingress controller (Nginx, Traefik, AWS Load Balancer Controller). Handles SSL termination, path-based routing, and virtual hosts. One Ingress replaces multiple LoadBalancer services for cost efficiency.

## 11. What is a ConfigMap vs a Secret in Kubernetes?

ConfigMap stores non-sensitive configuration (environment variables, config files) as key-value pairs—database URLs, feature flags. Secret stores sensitive data (passwords, API keys, TLS certificates)—base64 encoded by default, not encrypted (enable encryption at rest). Mount both as environment variables or files in pods. Never commit secrets to git—use external secret managers.

## 12. What is a PersistentVolume (PV) and PersistentVolumeClaim (PVC)?

PersistentVolume (PV) is cluster-level storage resource (like a disk) provisioned by admin or dynamically. PersistentVolumeClaim (PVC) is a pod's request for storage (size, access mode). Kubernetes binds PVC to available PV. Data persists beyond pod lifecycle—essential for databases and stateful applications. Storage classes enable dynamic provisioning on AWS Elastic Block Store (EBS), Google Persistent Disk.

## 13. What is kubectl?

kubectl is the command-line tool for interacting with Kubernetes clusters. Common commands: `kubectl get pods`, `kubectl describe pod <name>`, `kubectl logs <pod>`, `kubectl apply -f <file>`, `kubectl scale deployment <name> --replicas=5`, `kubectl exec -it <pod> -- /bin/sh`. Essential for debugging, deployment, and operations.

## 14. What is a Kubernetes namespace?

A namespace is a virtual cluster within a physical cluster for resource isolation. Default namespaces: `default`, `kube-system`, `kube-public`. Teams use namespaces to separate environments (dev, staging, prod) or teams. Resource quotas and network policies can be scoped per namespace. `kubectl get pods -n production`.

## 15. What is Horizontal Pod Autoscaler (HPA)?

Horizontal Pod Autoscaler (HPA) automatically scales the number of pod replicas based on metrics—typically CPU (Central Processing Unit) utilization or custom metrics (requests per second). Define min/max replicas and target utilization. HPA adds pods when load increases, removes when load decreases. Requires metrics server installed. Pair with Cluster Autoscaler for node-level scaling.

## 16. What is liveness vs readiness probes?

Liveness probe checks if a container is alive—if it fails, Kubernetes restarts the container (fix deadlocks). Readiness probe checks if a container is ready to serve traffic—if it fails, Kubernetes removes it from Service endpoints (handle startup time, temporary overload). Configure both in pod spec with HTTP, TCP (Transmission Control Protocol), or exec checks.

## 17. What is a rolling update in Kubernetes?

Rolling update gradually replaces old pods with new ones during a deployment—zero downtime. Strategy: maxUnavailable (how many can be down) and maxSurge (how many extra during update). If new pods fail readiness checks, rollout pauses automatically. Rollback with `kubectl rollout undo`. Default deployment strategy for production releases.

## 18. What is Helm?

Helm is the package manager for Kubernetes—charts are templated YAML bundles for deploying applications. Install complex stacks (Prometheus, PostgreSQL) with `helm install`. Supports versioning, rollback, and value overrides. Helm charts reduce boilerplate and standardize deployments across environments. CNCF graduated project.

## 19. What is Amazon Web Services (AWS)?

Amazon Web Services (AWS) is the leading cloud computing platform offering on-demand infrastructure: compute, storage, databases, networking, and managed services. Pay-as-you-go pricing across global regions and availability zones. Core services: EC2 (compute), S3 (storage), RDS (database), Lambda (serverless), EKS (Kubernetes). Most product companies use AWS, Google Cloud Platform (GCP), or Microsoft Azure.

## 20. What is EC2 (Elastic Compute Cloud)?

Elastic Compute Cloud (EC2) provides resizable virtual servers (instances) in the cloud. Choose instance types (CPU, memory, GPU), operating system, and storage. Auto Scaling Groups adjust capacity based on demand. Security Groups act as virtual firewalls. EC2 is the foundation for running applications before containers—or as Kubernetes worker nodes.

## 21. What is S3 (Simple Storage Service)?

Simple Storage Service (S3) is object storage for any amount of data—files, images, backups, logs. Buckets store objects keyed by name. Features: versioning, lifecycle policies (archive to Glacier), pre-signed URLs for direct upload, Static Website Hosting. 99.999999999% (11 nines) durability. Used for media storage, data lakes, and static asset hosting.

## 22. What is RDS (Relational Database Service)?

Relational Database Service (RDS) is managed SQL databases—PostgreSQL, MySQL, Oracle, SQL Server. AWS handles backups, patching, replication, and failover. Multi-AZ (Availability Zone) deployment for high availability. Read replicas for read scaling. Use RDS when you need managed operations; self-manage on EC2 for full control.

## 23. What is AWS Lambda?

AWS Lambda runs code without managing servers—serverless compute. Upload function, trigger on events (HTTP via API Gateway, S3 upload, Kafka message). Pay per invocation and duration (millisecond billing). Auto-scales from zero to thousands. Ideal for event processing, API backends with variable traffic, and scheduled tasks. Cold start latency is a consideration.

## 24. What is Amazon Elastic Container Registry (ECR)?

Elastic Container Registry (ECR) is AWS's managed Docker container registry. Store, manage, and deploy container images. Integrates with EKS and ECS (Elastic Container Service). Images scanned for vulnerabilities. Push with `docker push`; Kubernetes pulls via IAM role. Private registry—no need for Docker Hub in AWS deployments.

## 25. What is EKS (Elastic Kubernetes Service)?

Elastic Kubernetes Service (EKS) is AWS's managed Kubernetes. AWS manages the control plane (API server, etcd, scheduler); you manage worker nodes (EC2 or Fargate). Integrates with AWS VPC, IAM, ECR, and CloudWatch. Production-ready Kubernetes without managing control plane availability. Use for containerized microservices at scale on AWS.

## 26. What is a Virtual Private Cloud (VPC)?

Virtual Private Cloud (VPC) is an isolated network within AWS where you launch resources. Define IP ranges (CIDR blocks), subnets (public for load balancers, private for apps/databases), route tables, and security groups. VPC peering and VPN connect to other networks. Every AWS resource runs inside a VPC—network security foundation.

## 27. What is IAM (Identity and Access Management)?

Identity and Access Management (IAM) controls who can access AWS resources and how. Users, groups, roles, and policies (JSON documents defining permissions). Principle of least privilege: grant minimum required permissions. Roles (not access keys) for EC2 instances and Lambda functions. Enable Multi-Factor Authentication (MFA) for root account. Audit with AWS CloudTrail.

## 28. What is CloudWatch?

Amazon CloudWatch monitors AWS resources and applications. Collect metrics (CPU, memory, request count), logs (centralized log groups), and alarms (notify on thresholds). Dashboards visualize system health. CloudWatch Logs Insights queries log data. Integrates with SNS (Simple Notification Service) for alerts. Foundation of AWS observability—pair with X-Ray for tracing.

## 29. What is observability?

Observability is the ability to understand a system's internal state from its external outputs—logs, metrics, and traces. More than monitoring (known unknowns); observability handles unknown unknowns (unexpected failures). Three pillars: logs (what happened), metrics (how much/how fast), traces (request flow across services). Essential for debugging distributed microservices.

## 30. What is the difference between monitoring and observability?

Monitoring checks known metrics against thresholds (CPU > 80% → alert)—reactive, predefined. Observability enables exploratory analysis of any system behavior through rich telemetry—proactive, ad-hoc queries. Monitoring tells you something is wrong; observability helps you understand why. Both are needed: monitoring for alerts, observability for root cause analysis.

## 31. What is Prometheus?

Prometheus is an open-source monitoring system that scrapes metrics from targets at intervals, stores time-series data, and evaluates alerting rules. Uses PromQL (Prometheus Query Language) for queries. Pull-based model with service discovery. Standard for Kubernetes monitoring—kube-prometheus-stack deploys Prometheus, Grafana, and Alertmanager together.

## 32. What is Grafana?

Grafana is an open-source visualization platform for metrics, logs, and traces. Connects to Prometheus, Elasticsearch, CloudWatch, and 100+ data sources. Create dashboards with graphs, gauges, and heatmaps. Alerting rules notify via Slack, PagerDuty, email. Industry standard for operational dashboards—every DevOps team uses Grafana.

## 33. What is distributed tracing?

Distributed tracing tracks a single request as it flows through multiple microservices, showing latency at each step. Each service creates spans linked by trace ID. Identifies bottlenecks (which service is slow?) and failure points. Tools: Jaeger, Zipkin, AWS X-Ray, OpenTelemetry. Critical when a user request touches 10+ services.

## 34. What is OpenTelemetry?

OpenTelemetry (OTel) is a vendor-neutral standard for generating, collecting, and exporting telemetry data (traces, metrics, logs). Provides SDKs (Software Development Kits) for all languages and a collector for processing. Replaces vendor-specific agents (Datadog, New Relic proprietary SDKs). CNCF project—future-proof your observability instrumentation.

## 35. What is the ELK stack?

ELK stack: Elasticsearch (search and analytics engine), Logstash (log processing pipeline), Kibana (visualization dashboard). Collects, processes, and visualizes logs centrally. Modern variant: EFK (Elasticsearch, Fluentd, Kibana)—Fluentd replaces Logstash as lighter log shipper. Essential for searching production logs across hundreds of microservices.

## 36. What is a Service Level Objective (SLO) in observability?

Service Level Objective (SLO) is a target reliability metric—e.g., 99.9% of requests complete under 200 milliseconds over 30 days. Service Level Indicator (SLI) measures actual performance; error budget is allowed downtime (0.1% = ~43 minutes/month). SLOs drive engineering priorities: if error budget is exhausted, focus on reliability over features.

## 37. What is a runbook?

A runbook is a documented procedure for handling operational scenarios—production outage, database failover, scaling event. Contains: symptoms, diagnosis steps, remediation commands, escalation paths. On-call engineers follow runbooks during incidents. Good runbooks reduce Mean Time To Recovery (MTTR). Store in wiki or tools like PagerDuty or Grafana OnCall.

## 38. What is Infrastructure as Code (IaC)?

Infrastructure as Code (IaC) manages infrastructure through machine-readable definition files rather than manual configuration. Version-controlled, reviewable, repeatable. Tools: Terraform (multi-cloud), AWS CloudFormation (AWS-native), Pulumi (programming languages). Benefits: reproducible environments, disaster recovery, and audit trail. Essential for DevOps maturity.

## 39. What is Terraform?

Terraform by HashiCorp defines infrastructure using HashiCorp Configuration Language (HCL) files. Plan before apply (preview changes). State file tracks current infrastructure. Supports AWS, GCP, Azure, Kubernetes. Modules reuse configurations. `terraform plan` → `terraform apply`. Industry standard for Infrastructure as Code across cloud providers.

## 40. What is GitOps?

GitOps uses git as the single source of truth for infrastructure and application deployment. Changes go through pull requests; automated pipelines sync cluster state to git. Tools: ArgoCD, Flux for Kubernetes. Benefits: audit trail, rollback via git revert, and consistent deployments. Extends Infrastructure as Code principles to runtime operations.

## 41. What is a sidecar container pattern?

Sidecar pattern runs a helper container alongside the main application container in the same pod. Sidecar handles cross-cutting concerns: logging (Fluentd ships logs), proxy (Envoy for service mesh), or monitoring (metrics exporter). Main container stays focused on business logic. Common in Istio service mesh and log collection.

## 42. What is AWS Fargate?

AWS Fargate runs containers without managing servers—serverless compute for containers. No EC2 instances to provision or patch. Specify CPU and memory; Fargate handles infrastructure. Works with ECS and EKS. Good for variable workloads and teams without dedicated infrastructure engineers. Trade-off: less control, potentially higher cost at steady high load.

## 43. What is a stateful vs stateless workload in Kubernetes?

Stateless workloads (web APIs, workers) store no data in the container—any pod can handle any request. Use Deployments. Stateful workloads (databases, Kafka brokers) need stable network identity and persistent storage. Use StatefulSets with ordered pod names and PersistentVolumeClaims. Never run production databases as plain Deployments.

## 44. What is a StatefulSet in Kubernetes?

StatefulSet manages stateful applications with guaranteed pod identity and stable storage. Pods get predictable names (`web-0`, `web-1`), ordered deployment and scaling, and persistent volume per pod. Used for databases (PostgreSQL, MongoDB), Kafka brokers, and ZooKeeper. Headless Service provides stable DNS for each pod.

## 45. What is network policy in Kubernetes?

NetworkPolicy controls traffic between pods—allow/deny rules based on labels, namespaces, and ports. Default: all pods can communicate (open). Restrict: only frontend pods can reach backend pods on port 8080. Implements micro-segmentation for defense in depth. Requires a network plugin supporting NetworkPolicy (Calico, Cilium).

## 46. What is RBAC in Kubernetes?

Role-Based Access Control (RBAC) restricts who can perform which actions in a Kubernetes cluster. Roles define permissions (get pods, create deployments); RoleBindings assign roles to users/groups/service accounts. ClusterRoles apply cluster-wide. Principle of least privilege: developers get namespace-scoped access; CI/CD (Continuous Integration/Continuous Deployment) gets deployment permissions only.

## 47. What is pod resource requests and limits?

Requests: guaranteed CPU and memory allocated to a pod—scheduler uses for placement. Limits: maximum CPU and memory a pod can consume—exceeding memory limit kills the pod (Out Of Memory—OOM). Set both for production: requests ensure scheduling; limits prevent resource hogging. Right-size based on actual usage metrics from Prometheus.

## 48. What is cluster autoscaler?

Cluster Autoscaler automatically adjusts the number of nodes in a Kubernetes cluster based on pending pods. If pods cannot be scheduled (insufficient resources), it adds nodes. If nodes are underutilized, it removes them. Works with cloud provider auto scaling groups (AWS Auto Scaling Groups). Pair with HPA for full automatic scaling.

## 49. How do you debug a crashing pod in Kubernetes?

Steps: `kubectl get pods` (check status: CrashLoopBackOff), `kubectl describe pod <name>` (events, exit codes), `kubectl logs <pod>` (application logs), `kubectl logs <pod> --previous` (logs from crashed container), `kubectl exec -it <pod> -- /bin/sh` (interactive debug if running). Common causes: OOM, missing environment variables, failed liveness probe, image pull errors.

## 50. Summarize Kubernetes and cloud interview checklist?

Cover: Docker fundamentals (image, container, Dockerfile), Kubernetes core objects (Pod, Deployment, Service, Ingress), scaling (HPA, cluster autoscaler), AWS basics (EC2, S3, RDS, Lambda, EKS, VPC, IAM), observability (Prometheus, Grafana, ELK, tracing, SLOs), Infrastructure as Code (Terraform, GitOps), and debugging workflow. Draw architecture diagrams showing how components connect in production.
