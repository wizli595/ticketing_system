apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{name}}-depl
spec:
  replicas: 1
  selector:
    matchLabels:
      app: {{name}}
  template:
    metadata:
      labels:
        app: {{name}}
    spec:
      containers:
        - name: {{name}}
          image: {{dockerUser}}/{{name}}:latest
          imagePullPolicy: IfNotPresent
          resources:
            requests:
              memory: "128Mi"
              cpu: "100m"
            limits:
              memory: "512Mi"
              cpu: "500m"
{{#if port}}
          ports:
            - containerPort: {{port}}
          readinessProbe:
            tcpSocket:
              port: {{port}}
            initialDelaySeconds: 5
            periodSeconds: 10
          livenessProbe:
            tcpSocket:
              port: {{port}}
            initialDelaySeconds: 15
            periodSeconds: 20
{{/if}}
          env:
            - name: JWT_KEY
              valueFrom:
                secretKeyRef:
                  name: jwt-secret
                  key: JWT_KEY
{{#if nats}}
            - name: NATS_CLIENT_ID
              valueFrom:
                fieldRef:
                  fieldPath: metadata.name
            - name: NATS_URL
              value: "http://nats-srv:4222"
            - name: NATS_CLUSTER_ID
              value: "ticketing"
{{/if}}
{{#if mongo}}
            - name: MONGO_URI
              value: "mongodb://{{name}}-mongo-srv:27017/{{name}}"
{{/if}}
{{#if stripe}}
            - name: STRIPE_KEY
              valueFrom:
                secretKeyRef:
                  name: stripe-secret
                  key: STRIPE_KEY
{{/if}}
---
{{#if port}}
apiVersion: v1
kind: Service
metadata:
  name: {{name}}-srv
spec:
  selector:
    app: {{name}}
  ports:
    - name: {{name}}
      protocol: TCP
      port: {{port}}
      targetPort: {{port}}
{{/if}}
