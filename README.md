# D2R PvP Full

![Project Banner](https://via.placeholder.com/1200x400.png?text=D2R+PvP+Full)

**A Diablo II: Resurrected (D2R) PvP result recording and sharing site.** This project is designed to store, view, and share D2R PvP results efficiently.

## 📌 Key Features
- **PvP Result Recording** – Save and retrieve in-game PvP match results.
- **Data Viewing & Sharing** – Search and share player records easily.
- **UI-Based Management System** – Access and input data seamlessly via the web interface.
- **Built with NestJS & Svelte** – Backend powered by NestJS, frontend built using Svelte.

## 🚀 Installation
### Prerequisites
- **Node.js** (Latest LTS version recommended)
- **MariaDB or MySQL** (Database required for storing records)

### Steps
1. **Clone the repository**
   ```sh
   git clone https://github.com/SuperBallista/d2rpvpfull.git
   ```
2. **Build the frontend**
   ```sh
   cd d2rpvpfull/Front
   npm install
   npm run build
   ```
3. **Move the built frontend files to the server**
   - Rename `Front/build` to `Server/front` and move it.
   ```sh
   mv Front/build Server/front
   ```
4. **Start the backend**
   ```sh
   cd Server
   npm install
   npm run start
   ```

## 🛠️ Configuration
- Edit the `.env` file to set up database and server configurations.

## 📖 Documentation
For detailed instructions, visit the **[Wiki](https://github.com/SuperBallista/d2rpvpfull/wiki)** (to be updated).

## 🤝 Contributing
Contributions are welcome! Follow these steps to contribute:
1. **Fork the repository**
2. **Create a new branch** for your changes
   ```sh
   git checkout -b feature-name
   ```
3. **Commit your changes**
   ```sh
   git commit -m "Add feature: XYZ"
   ```
4. **Push to GitHub and open a Pull Request**
   ```sh
   git push origin feature-name
   ```

## 📜 License
This project is licensed under the **MIT License**. See the [`LICENSE`](LICENSE) file for details.

## 🏆 Credits
- **Project Lead:** [SuperBallista](https://github.com/SuperBallista)
- **Contributors:** [List of contributors](https://github.com/SuperBallista/d2rpvpfull/graphs/contributors)

## 📬 Contact
For support or inquiries, create an **issue** on GitHub or reach out via [Discord](#) (if available).

---

# D2R PvP Full (Korean)

![프로젝트 배너](https://via.placeholder.com/1200x400.png?text=D2R+PvP+Full)

**Diablo II: Resurrected (D2R) PvP 기록 및 공유 사이트**입니다. 이 프로젝트는 D2R의 PvP 결과를 저장, 조회, 공유할 수 있도록 설계되었습니다.

## 📌 주요 기능
- **PvP 결과 기록** – 게임 내 PvP 전적을 저장하고 조회 가능
- **데이터 조회 및 공유** – 플레이어별 전적 검색 및 공유 기능
- **UI 기반 관리 시스템** – 웹사이트에서 쉽게 조회 및 데이터 입력 가능
- **NestJS + Svelte 기반** – 서버는 NestJS로, 프론트엔드는 Svelte로 구현됨

## 🚀 설치 방법
### 필수 요구 사항
- **Node.js** (최신 LTS 버전 권장)
- **MariaDB 또는 MySQL** (데이터 저장을 위한 데이터베이스 필요)

### 설치 단계
1. **저장소 클론**
   ```sh
   git clone https://github.com/SuperBallista/d2rpvpfull.git
   ```
2. **프론트엔드 빌드**
   ```sh
   cd d2rpvpfull/Front
   npm install
   npm run build
   ```
3. **빌드된 파일을 서버로 이동**
   - `Front/build` 폴더를 `Server/front` 폴더로 이름 변경 후 이동
   ```sh
   mv Front/build Server/front
   ```
4. **백엔드 실행**
   ```sh
   cd Server
   npm install
   npm run start
   ```

## 🛠️ 환경 설정
- `.env` 파일을 수정하여 데이터베이스 및 서버 설정을 지정하세요.

## 📖 문서
자세한 설명은 **[Wiki](https://github.com/SuperBallista/d2rpvpfull/wiki)**에서 확인할 수 있습니다. (업데이트 예정)

## 🤝 기여 방법
기여를 환영합니다! 다음 단계를 따라 기여할 수 있습니다:
1. **저장소 포크(Fork)**
2. **새로운 브랜치 생성** 후 변경 사항 적용
   ```sh
   git checkout -b feature-name
   ```
3. **변경 사항 커밋**
   ```sh
   git commit -m "기능 추가: XYZ"
   ```
4. **GitHub에 푸시 후 Pull Request 생성**
   ```sh
   git push origin feature-name
   ```

## 📜 라이선스
이 프로젝트는 **MIT 라이선스**에 따라 배포됩니다. 자세한 내용은 [`LICENSE`](LICENSE) 파일을 참조하세요.

## 🏆 크레딧
- **프로젝트 리드:** [SuperBallista](https://github.com/SuperBallista)
- **기여자:** [기여자 목록](https://github.com/SuperBallista/d2rpvpfull/graphs/contributors)

## 📬 문의
지원이 필요하거나 문의사항이 있으면 **GitHub Issue**를 생성하거나 [Discord](#)를 통해 연락 주세요. (가능한 경우)
