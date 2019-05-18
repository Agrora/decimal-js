
module.exports = {
    resolveSnapshotPath: (testPath, snapshotExtension) =>
        testPath.replace('tests/', 'tests/snapshots/') + snapshotExtension,

    resolveTestPath: (snapshotFilePath, snapshotExtension) =>
        snapshotFilePath
            .replace('tests/snapshots/', 'tests/')
            .slice(0, -snapshotExtension.length),

    testPathForConsistencyCheck: 'project-dir/tests/sub-directory/example.test.js',
};