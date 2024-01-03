describe("Tests written in jome", function () {
test('1 + 1', function () {
expect(compile(`obj->call`)).toMatch(/obj.call\(\)/)
})
})