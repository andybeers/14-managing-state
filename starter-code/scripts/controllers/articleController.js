(function(module) {
  var articlesController = {};

  Article.createTable();

  articlesController.index = function(ctx, next) {
    articleView.index(ctx.articles);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  // It's in the middleware chain for /articles/:id.
  // When a request comes for the /articles/:id, this method is called.
  // Article.findWhere is a method to dynamically query the database.
  // It is passed the field (column) to select for, where the value equals the
  // second argument passed in: in this case SELECT id WHERE it equals the id param
  // of the ctx object. findWhere passes article data the results from the SQL query.
  // articleData then sets that value as a property of the context object, which is
  // later used by articleController.index
  // Execution path: takes ctx and next -> calls findWhere -> selects from database
  // -> calls articleData -> next function (articleController.index)
  articlesController.loadById = function(ctx, next) {
    var articleData = function(article) {
      ctx.articles = article;
      next();
    };

    Article.findWhere('id', ctx.params.id, articleData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  // The function runs when pages receives a request for the /author/:authorName route.
  // It queries the database with a select for authors where the value equals the
  // authorName parameter of the ctx object (with a replace for turning + into spaces).
  // It then calls authorData with the SQL query return, and then sets the ctx.author
  // property to that value. Finally, has page call the next function (also articlesController.index)
  // Execution path: akes ctx and next -> calls findWhere -> selects from database
  // -> calls authorData -> next function (articleController.index)
  articlesController.loadByAuthor = function(ctx, next) {
    var authorData = function(articlesByAuthor) {
      ctx.articles = articlesByAuthor;
      next();
    };
    Article.findWhere(
      'author', ctx.params.authorName.replace('+', ' '), authorData
    );
  };

  // COMMENT: What does this method do?  What is it's execution path?
  // Same as the previous two methods, but instead it searches the database by
  // category, and then sets the the articles property of the ctx object to the
  // results of the SQL query.
  // Execution path: akes ctx and next -> calls findWhere -> selects from database
  // -> calls categoryData -> next function (articleController.index)
  articlesController.loadByCategory = function(ctx, next) {
    var categoryData = function(articlesInCategory) {
      ctx.articles = articlesInCategory;
      next();
    };

    Article.findWhere('category', ctx.params.categoryName, categoryData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  // When pages gets a request for the home / directory, this method is called.
  // If the array of articles is populated, it calls articlesController.index to
  // render the index page, and sets the ctx obj 'articles' property to the array
  // of all articles. If there aren't any articles in the array, it calls Article.fetchAll
  // which is an AJAX call to the database. It then calls articleData, which sets the ctx
  // property, and calls articlesController.index.
  // Execution path: passed in ctx and next from pages -> checks Articles.all ->
  // fetchAll -> articleData -> next / articlesController.index
  // (or short-circuits the fetchAll step)
  articlesController.loadAll = function(ctx, next) {
    var articleData = function(allArticles) {
      ctx.articles = Article.all;
      next();
    };

    if (Article.all.length) {
      ctx.articles = Article.all;
      next();
    } else {
      Article.fetchAll(articleData);
    }
  };

  module.articlesController = articlesController;
})(window);
