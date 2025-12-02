using LibraryApp.Domain.Entities;
using LibraryApp.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LibraryApp.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRepository<Category> _categoryRepository;

    public CategoriesController(IUnitOfWork unitOfWork, IRepository<Category> categoryRepository)
    {
        _unitOfWork = unitOfWork;
        _categoryRepository = categoryRepository;
    }

    private Guid GetUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.Parse(userId!);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetAllCategories()
    {
        try
        {
            var userId = GetUserId();
            var categories = await _categoryRepository.FindAsync(c => c.UserId == userId);
            
            var categoryDtos = categories
                .OrderBy(c => c.Name)
                .Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Color = c.Color,
                    CreatedAt = c.CreatedAt
                });

            return Ok(categoryDtos);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult<CategoryDto>> CreateCategory([FromBody] CreateCategoryRequest request)
    {
        try
        {
            var userId = GetUserId();
            var category = new Category
            {
                Name = request.Name,
                Color = request.Color,
                UserId = userId
            };

            await _categoryRepository.AddAsync(category);
            await _unitOfWork.SaveChangesAsync();

            var categoryDto = new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Color = category.Color,
                CreatedAt = category.CreatedAt
            };

            return CreatedAtAction(nameof(GetAllCategories), new { id = category.Id }, categoryDto);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteCategory(Guid id)
    {
        try
        {
            var userId = GetUserId();
            var categories = await _categoryRepository.FindAsync(c => c.Id == id && c.UserId == userId);
            var category = categories.FirstOrDefault();

            if (category == null)
            {
                return NotFound(new { message = "Category not found" });
            }

            await _categoryRepository.DeleteAsync(category);
            await _unitOfWork.SaveChangesAsync();

            return Ok(new { message = "Category deleted successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}

public class CategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Color { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateCategoryRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Color { get; set; }
}
