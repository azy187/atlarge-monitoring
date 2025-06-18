/**
 *  @param testFile path to the test e.g `project_x/test_y`
 *  @returns [internalProjectName, testName]
 */
function getTestNameAndProjectFolderName(testFile: string) {
  return testFile.split("/");
}

export { getTestNameAndProjectFolderName };
