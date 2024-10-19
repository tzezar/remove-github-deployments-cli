# remove-github-deployments-cli

A command-line interface (CLI) tool to remove deployments from your GitHub repositories.

## Features

- Easily remove deployments from a specified GitHub repository.
- Optionally, remove active deployments.
- Interactive prompts for user input to ensure safe deletion.

## Installation

You can run it directly using `npx`:

```

npx remove-github-deployments-cli@latest init

```

Alternatively, you can install this CLI globally using npm:

```

npm install -g remove-github-deployments-cli

```



## Usage

To remove deployments, run the following command:

```

remove-github-deployments-cli init

```

### Interactive Prompts

1. **Enter your GitHub access token**: This token must have the necessary permissions to access and delete deployments in your repository.
2. **Enter the repository name**: Format should be `owner/repo`, for example, `username/my-repo`.
3. **Remove active deployments**: Choose whether you want to remove active deployments as well.
4. **Confirm deletion**: A final confirmation before any deployments are deleted.

### Example

```

npx remove-github-deployments-cli@latest init

```

## Requirements

- Node.js (version 12 or higher)
- GitHub personal access token with `repo` scope.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Author

[Sebastian "Tzezar" Drozd](https://github.com/tzezar)
