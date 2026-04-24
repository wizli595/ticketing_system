apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{name}}-mongo-depl
spec:
  replicas: 1
  selector:
    matchLabels:
      app: {{name}}-mongo
  template:
    metadata:
      labels:
        app: {{name}}-mongo
    spec:
      containers:
        - name: {{name}}-mongo
          image: mongo
          ports:
            - containerPort: 27017
          resources:
            requests:
              memory: "128Mi"
              cpu: "100m"
            limits:
              memory: "256Mi"
              cpu: "250m"
---
apiVersion: v1
kind: Service
metadata:
  name: {{name}}-mongo-srv
spec:
  selector:
    app: {{name}}-mongo
  ports:
    - name: db
      protocol: TCP
      port: 27017
      targetPort: 27017
