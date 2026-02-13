# Language Learning Zone

## To-do
- [ ] Fix streaming laggy problem

## Roadmap
- [x] Standardize basic lang code
- [x] Web frontend
- [x] Docker support

## To run it locally

### Requirement
- bun (Tested on v1.3.9)

```bash

# install frontend dependencies
cd ./frontend
bun install

# install server dependencies
cd .. 
bun install

# run
bun run ./src/server.ts

```

## Docker
```bash

# path ./language-learning-zone
docker build -t language-learning-zone .
docker run -p "1668:1668" language-learning-zone

```